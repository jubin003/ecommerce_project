// subscriptionController.js
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

// Get all subscription plans
export const getAllSubscriptions = async (req, res) => {
  try {
    const plans = await Subscription.find();
    res.status(200).json(plans);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a user's subscription
export const getUserSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const subscriptionData = user.subscribed ? { isActive: true } : null;
    res.status(200).json({ subscription: subscriptionData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign subscription to a user
export const assignSubscriptionToUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.subscribed = true;
    await user.save();

    res.status(200).json({
      message: "Subscribed successfully",
      subscription: { isActive: true },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

