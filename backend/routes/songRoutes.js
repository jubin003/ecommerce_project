import express from "express";
import multer from "multer";
import { addSong, getSongs, deleteSong } from "../controllers/songController.js";

const router = express.Router();

// Multer storage for MP3 files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/songs/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", getSongs);
router.post("/add", upload.single("file"), addSong); // admin only
router.delete("/:id", deleteSong); // admin only

export default router;
