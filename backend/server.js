import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";

import songRoutes from "./routes/songRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import vinylRoutes from "./routes/vinylRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
// Removed subscriptionRoutes

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create upload directories
["uploads/songs", "uploads/covers", "uploads/vinyls"].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Static file serving
app.use("/uploads/songs", express.static("uploads/songs"));
app.use("/uploads/covers", express.static("uploads/covers"));
app.use("/uploads/vinyls", express.static("uploads/vinyls"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/songs", songRoutes);
// Removed subscription routes
app.use("/api/playlists", playlistRoutes);
app.use("/api/vinyls", vinylRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(console.error);