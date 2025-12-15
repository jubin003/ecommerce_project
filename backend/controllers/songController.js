import Song from "../models/Song.js";

export const getSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addSong = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { title, artist, album, duration } = req.body;

    if (!req.files?.file) {
      return res.status(400).json({ message: "MP3 file is required" });
    }

    const audioFile = req.files.file[0];
    const coverImage = req.files.coverArt?.[0];

    const newSong = await Song.create({
      title,
      artist,
      album: album || "",
      duration: duration || 0,
      url: `/uploads/songs/${audioFile.filename}`,
      coverArt: coverImage
        ? `/uploads/covers/${coverImage.filename}`
        : "https://placehold.co/300x300?text=No+Cover",
    });

    res.status(201).json({ message: "Song uploaded successfully", song: newSong });
  } catch (err) {
    console.error("ADD SONG ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
