import mongoose from "mongoose";
import dotenv from "dotenv";
import Subscription from "./models/Subscription.js";

dotenv.config();

const subscriptionPlans = [
  {
    planName: "Basic Plan",
    price: 9.99,
    durationInDays: 30,
    features: ["Unlimited streaming", "Create playlists", "Ad-free experience"],
  },
  {
    planName: "Premium Plan",
    price: 14.99,
    durationInDays: 30,
    features: ["Unlimited streaming", "Create playlists", "Ad-free experience", "HD Audio Quality", "Offline Downloads"],
  },
  {
    planName: "Family Plan",
    price: 19.99,
    durationInDays: 30,
    features: ["Unlimited streaming", "Create playlists", "Ad-free experience", "HD Audio Quality", "Offline Downloads", "Up to 6 accounts"],
  },
];

const seedSubscriptions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Clear existing subscriptions
    await Subscription.deleteMany({});
    console.log("Cleared existing subscriptions");

    // Insert new subscriptions
    await Subscription.insertMany(subscriptionPlans);
    console.log("Subscription plans seeded successfully!");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding subscriptions:", err);
    process.exit(1);
  }
};

seedSubscriptions();