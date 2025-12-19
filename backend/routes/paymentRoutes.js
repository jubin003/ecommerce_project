import express from "express";
import {
  initializeKhaltiPaymentController,
  completeKhaltiPayment,
  getPaymentDetails,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Initialize Khalti payment
router.post("/initialize-khalti", protect, initializeKhaltiPaymentController);

// Complete Khalti payment (callback URL)
router.get("/complete-khalti-payment", completeKhaltiPayment);

// Get payment details
router.get("/:orderId", protect, getPaymentDetails);

export default router;