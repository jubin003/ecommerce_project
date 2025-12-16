import Vinyl from "../models/Vinyl.js";
import Song from "../models/Song.js";

// Get all vinyls
export const getAllVinyls = async (req, res) => {
  try {
    const vinyls = await Vinyl.find().populate("song");
    res.status(200).json(vinyls);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Get vinyl by song ID
export const getVinylBySong = async (req, res) => {
  try {
    const vinyl = await Vinyl.findOne({ song: req.params.songId }).populate("song");
    if (!vinyl) {
      return res.status(404).json({ message: "Vinyl not found for this song" });
    }
    res.status(200).json(vinyl);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Add vinyl (admin only)
export const addVinyl = async (req, res) => {
  try {
    const { songId, price, quantity } = req.body;

    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Check if vinyl already exists for this song
    const existingVinyl = await Vinyl.findOne({ song: songId });
    if (existingVinyl) {
      return res.status(400).json({ message: "Vinyl already exists for this song" });
    }

    const vinylImage = req.file
      ? `/uploads/vinyls/${req.file.filename}`
      : "https://placehold.co/300x300?text=Vinyl";

    const newVinyl = await Vinyl.create({
      song: songId,
      price,
      quantity,
      vinylImage,
    });

    const populatedVinyl = await Vinyl.findById(newVinyl._id).populate("song");
    res.status(201).json({ message: "Vinyl added successfully", vinyl: populatedVinyl });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Update vinyl (admin only)
export const updateVinyl = async (req, res) => {
  try {
    const { price, quantity } = req.body;
    const updateData = { price, quantity };

    if (req.file) {
      updateData.vinylImage = `/uploads/vinyls/${req.file.filename}`;
    }

    const vinyl = await Vinyl.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("song");

    if (!vinyl) {
      return res.status(404).json({ message: "Vinyl not found" });
    }

    res.status(200).json({ message: "Vinyl updated successfully", vinyl });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Delete vinyl (admin only)
export const deleteVinyl = async (req, res) => {
  try {
    const vinyl = await Vinyl.findByIdAndDelete(req.params.id);
    if (!vinyl) {
      return res.status(404).json({ message: "Vinyl not found" });
    }
    res.status(200).json({ message: "Vinyl deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};