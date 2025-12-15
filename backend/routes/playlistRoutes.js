import express from "express";
import { createPlaylist } from "../controllers/playlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create",protect ,createPlaylist); // subscribed users only
//router.get("/user/:userId", getUserPlaylists);

export default router;
