import express from "express";
import { createPlaylist, getUserPlaylists } from "../controllers/playlistController.js";

const router = express.Router();

router.post("/create", createPlaylist); // subscribed users only
router.get("/user/:userId", getUserPlaylists);

export default router;
