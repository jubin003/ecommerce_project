// backend/routes/userRoutes.js
import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { protect, adminonly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminonly, getAllUsers);

export default router;
