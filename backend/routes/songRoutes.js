import express from "express";
import multer from "multer";
import { addSong, getSongs, deleteSong } from "../controllers/songController.js";
import { protect, adminonly } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/songs/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", protect, getSongs);
router.post("/add", protect, adminonly, upload.single("file"), addSong);
router.delete("/:id", protect, adminonly, deleteSong);

export default router;
