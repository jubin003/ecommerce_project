import Song from "../models/Song.js";

// Get all songs
export const getSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new song (admin only, with MP3 and cover art upload)
export const addSong = async (req, res) => {
  try {
    const { title, artist, album, duration, coverArt } = req.body;

    if (!req.file) return res.status(400).json({ message: "MP3 file is required" });

    const fileUrl = `/uploads/songs/${req.file.filename}`;

    const newSong = await Song.create({
      title,
      artist,
      album: album || "",
      duration: duration || 0,
      url: fileUrl,
      coverArt: coverArt || "https://via.placeholder.com/220x180?text=No+Cover",
    });

    res.status(201).json({ message: "Song uploaded successfully", song: newSong });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a song (admin only)
export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};