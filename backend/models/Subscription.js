import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    durationInDays: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);