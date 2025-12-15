import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/songs",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "audio/mpeg") {
    cb(null, true);
  } else {
    cb(new Error("Only MP3 files allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
