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

// Add a new song (admin only, with MP3 upload)
export const addSong = async (req, res) => {
  try {
    const { title, artist, album, duration } = req.body;

    if (!req.file) return res.status(400).json({ message: "MP3 file is required" });

    const fileUrl = `/uploads/songs/${req.file.filename}`;

    const newSong = await Song.create({
      title,
      artist,
      album,
      duration,
      url: fileUrl,
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
