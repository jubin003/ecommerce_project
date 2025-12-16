import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminonly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/user/:userId", protect, getUserOrders);
router.get("/all", protect, adminonly, getAllOrders);
router.put("/:id/status", protect, adminonly, updateOrderStatus);

export default router;