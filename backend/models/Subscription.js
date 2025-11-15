import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true }, // e.g., Free, Premium
    price: { type: Number, required: true },
    durationInDays: { type: Number, required: true }, // e.g., 30 days
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
