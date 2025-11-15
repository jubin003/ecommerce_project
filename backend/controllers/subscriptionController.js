import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

// Get all plans
export const getPlans = async (req, res) => {
  try {
    const plans = await Subscription.find();
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign subscription to user
export const assignSubscription = async (req, res) => {
  try {
    const { userId, subscriptionId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.subscription = subscriptionId;
    await user.save();

    res.status(200).json({ message: "Subscription assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check if user has subscription
export const checkUserSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("subscription");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ hasSubscription: !!user.subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
