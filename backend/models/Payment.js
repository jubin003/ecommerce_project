import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // IMPORTANT: This allows multiple null values
    },
    pidx: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    purchasedVinyls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PurchasedVinyl",
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    dataFromVerificationReq: {
      type: Object,
    },
    apiQueryFromUser: {
      type: Object,
    },
    paymentGateway: {
      type: String,
      enum: ["khalti", "esewa", "connectIps"],
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;