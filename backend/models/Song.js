import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true },
    album: { type: String, default: "" },
    duration: { type: Number, default: 0 }, // in seconds
    url: { type: String, required: true }, // file or stream URL
    coverArt: { 
      type: String, 
      default: "https://via.placeholder.com/220x180?text=No+Cover"
    }, // image URL with default
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);
export default Song;