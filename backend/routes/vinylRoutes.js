import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllVinyls,
  getVinylBySong,
  addVinyl,
  updateVinyl,
  deleteVinyl,
} from "../controllers/vinylController.js";
import { protect, adminonly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer storage for vinyl images
const storage = multer.diskStorage({
  destination: "uploads/vinyls",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.fieldname + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes
router.get("/", protect, getAllVinyls);
router.get("/song/:songId", protect, getVinylBySong);
router.post("/add", protect, adminonly, upload.single("vinylImage"), addVinyl);
router.put("/:id", protect, adminonly, upload.single("vinylImage"), updateVinyl);
router.delete("/:id", protect, adminonly, deleteVinyl);

export default router;