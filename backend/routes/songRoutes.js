import express from "express";
import multer from "multer";
import path from "path";
import { addSong, getSongs, deleteSong } from "../controllers/songController.js";
import { protect, adminonly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "coverArt") {
      cb(null, "uploads/covers");
    } else {
      cb(null, "uploads/songs");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.fieldname + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "file" && file.mimetype === "audio/mpeg") {
    cb(null, true);
  } else if (
    file.fieldname === "coverArt" &&
    ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes
router.get("/", protect, getSongs);
router.post(
  "/add",
  protect,
  adminonly,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "coverArt", maxCount: 1 },
  ]),
  addSong
);
router.delete("/:id", protect, adminonly, deleteSong);

export default router;
