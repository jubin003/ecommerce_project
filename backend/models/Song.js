import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true },
    album: { type: String },
    duration: { type: Number }, // in seconds
    url: { type: String, required: true }, // file or stream URL
    coverArt: { type: String }, // image URL
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);
export default Song;
