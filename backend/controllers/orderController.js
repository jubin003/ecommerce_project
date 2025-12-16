import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Vinyl from "../models/Vinyl.js";

// Create order from cart (checkout)
export const createOrder = async (req, res) => {
  try {
    const { userId, shippingAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.vinyl",
      populate: { path: "song" },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate stock and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const vinyl = await Vinyl.findById(item.vinyl._id);

      if (!vinyl) {
        return res.status(404).json({ message: `Vinyl not found` });
      }

      if (vinyl.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${vinyl.song?.title || "item"}`,
        });
      }

      // Reduce vinyl quantity
      vinyl.quantity -= item.quantity;
      await vinyl.save();

      orderItems.push({
        vinyl: item.vinyl._id,
        quantity: item.quantity,
        price: vinyl.price,
      });

      totalAmount += vinyl.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id).populate({
      path: "items.vinyl",
      populate: { path: "song" },
    });

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate({
        path: "items.vinyl",
        populate: { path: "song" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate({
        path: "items.vinyl",
        populate: { path: "song" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate({
      path: "items.vinyl",
      populate: { path: "song" },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};