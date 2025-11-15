import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: String, default: "basic" }, // basic, premium, etc.
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
});

export default mongoose.model("Subscription", subscriptionSchema);
