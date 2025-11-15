import express from "express";
import {
  getAllSubscriptions,
  assignSubscriptionToUser,
  getUserSubscription
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all subscription plans
router.get("/", getAllSubscriptions);

// Get a specific user's subscription
router.get("/:userId", protect, getUserSubscription);

// Assign subscription to a user
router.post("/assign", protect, assignSubscriptionToUser);

export default router;
