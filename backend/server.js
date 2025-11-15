import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import songRoutes from "./routes/songRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import userRoutes from "./routes/userRoutes.js";


import playlistRoutes from "./routes/playlistRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import cors from "cors";


dotenv.config(); // load env variables

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));


// Serve MP3 files
app.use("/uploads/songs", express.static(path.join(path.resolve(), "uploads/songs")));

// Routes
app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/subscriptions", subscriptionRoutes);


app.use("/api/playlists", playlistRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
  .catch(err => console.log(err));
