import express from "express";
import multer from "multer";
import path from "path";
import {
  addSong,
  getSongs,
  deleteSong
} from "../controllers/songController.js";
import { protect, adminonly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/songs");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// ✅ File filter (ONLY MP3)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "audio/mpeg") {
    cb(null, true);
  } else {
    cb(new Error("Only MP3 files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes
router.get("/", protect, getSongs);

router.post(
  "/add",
  protect,
  adminonly,
  upload.single("file"), // ⚠ frontend MUST use "file"
  addSong
);

router.delete("/:id", protect, adminonly, deleteSong);

export default router;
