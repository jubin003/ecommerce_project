import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user's cart
router.get("/:userId", protect, getCart);

// Add item to cart
router.post("/add", protect, addToCart);

// Update cart item quantity
router.put("/update", protect, updateCartItem);

// Remove item from cart
router.delete("/remove", protect, removeFromCart);

// Clear entire cart
router.delete("/clear/:userId", protect, clearCart);

export default router;