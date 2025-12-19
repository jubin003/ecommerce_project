import Payment from "../models/Payment.js";
import PurchasedVinyl from "../models/PurchasedVinyl.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Vinyl from "../models/Vinyl.js";
import { initializeKhaltiPayment, verifyKhaltiPayment } from "../services/khalti.js";

// Initialize Khalti Payment
export const initializeKhaltiPaymentController = async (req, res) => {
  try {
    const { userId, shippingAddress, website_url } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.vinyl",
      populate: { path: "song" },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Validate stock and calculate total
    let totalAmount = 0;
    const purchasedVinylsData = [];

    for (const item of cart.items) {
      const vinyl = await Vinyl.findById(item.vinyl._id);

      if (!vinyl) {
        return res.status(404).json({
          success: false,
          message: `Vinyl not found`,
        });
      }

      if (vinyl.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${vinyl.song?.title || "item"}`,
        });
      }

      totalAmount += vinyl.price * item.quantity;

      // Create purchased vinyl records
      const purchasedVinyl = await PurchasedVinyl.create({
        user: userId,
        vinyl: item.vinyl._id,
        quantity: item.quantity,
        totalPrice: vinyl.price * item.quantity,
        shippingAddress,
        paymentMethod: "khalti",
        status: "pending",
      });

      purchasedVinylsData.push(purchasedVinyl);
    }

    // Create order
    const order = await Order.create({
      user: userId,
      items: cart.items.map((item) => ({
        vinyl: item.vinyl._id,
        quantity: item.quantity,
        price: item.vinyl.price,
      })),
      totalAmount,
      shippingAddress,
      status: "pending",
    });

    // Initialize Khalti payment
    const paymentInitiate = await initializeKhaltiPayment({
      amount: totalAmount * 100, // Convert to paisa
      purchase_order_id: order._id.toString(),
      purchase_order_name: `Order ${order._id}`,
      return_url: `${process.env.BACKEND_URI || "http://localhost:5001"}/api/payment/complete-khalti-payment`,
      website_url: website_url || "http://localhost:5173",
    });

    // Create payment record
    await Payment.create({
      pidx: paymentInitiate.pidx,
      user: userId,
      order: order._id,
      purchasedVinyls: purchasedVinylsData.map((pv) => pv._id),
      amount: totalAmount * 100,
      paymentGateway: "khalti",
      status: "pending",
    });

    res.json({
      success: true,
      order,
      payment: paymentInitiate,
      purchasedVinyls: purchasedVinylsData,
    });
  } catch (error) {
    console.error("Error initializing Khalti payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initialize payment",
      error: error.message,
    });
  }
};

// Complete Khalti Payment (Verification)
export const completeKhaltiPayment = async (req, res) => {
  const {
    pidx,
    txnId,
    amount,
    mobile,
    purchase_order_id,
    purchase_order_name,
    transaction_id,
  } = req.query;

  try {
    // Verify payment with Khalti
    const paymentInfo = await verifyKhaltiPayment(pidx);

    // Check if payment is completed and details match
    if (
      paymentInfo?.status !== "Completed" ||
      paymentInfo.transaction_id !== transaction_id ||
      Number(paymentInfo.total_amount) !== Number(amount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        paymentInfo,
      });
    }

    // Find the payment record
    const payment = await Payment.findOne({ pidx });

    if (!payment) {
      return res.status(400).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Update payment record
    await Payment.findByIdAndUpdate(payment._id, {
      $set: {
        transactionId: transaction_id,
        status: "success",
        dataFromVerificationReq: paymentInfo,
        apiQueryFromUser: req.query,
      },
    });

    // Update order status
    const order = await Order.findByIdAndUpdate(
      purchase_order_id,
      {
        $set: {
          status: "processing",
        },
      },
      { new: true }
    ).populate({
      path: "items.vinyl",
      populate: { path: "song" },
    });

    // Update purchased vinyl records
    await PurchasedVinyl.updateMany(
      { _id: { $in: payment.purchasedVinyls } },
      {
        $set: {
          status: "completed",
        },
      }
    );

    // Reduce vinyl stock quantities
    for (const item of order.items) {
      await Vinyl.findByIdAndUpdate(item.vinyl._id, {
        $inc: { quantity: -item.quantity },
      });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: order.user },
      {
        $set: {
          items: [],
        },
      }
    );

    // Redirect to success page
    res.redirect(`${process.env.FRONTEND_URI || "http://localhost:5173"}/payment-success?orderId=${order._id}`);
  } catch (error) {
    console.error("Error completing Khalti payment:", error);
    res.redirect(`${process.env.FRONTEND_URI || "http://localhost:5173"}/payment-failed`);
  }
};

// Get payment details
export const getPaymentDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const payment = await Payment.findOne({ order: orderId })
      .populate("user", "name email")
      .populate({
        path: "order",
        populate: {
          path: "items.vinyl",
          populate: { path: "song" },
        },
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment details",
      error: error.message,
    });
  }
};