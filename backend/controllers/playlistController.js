import Playlist from "../models/Playlist.js";
import User from "../models/User.js";

// Create playlist (subscribed users only)
export const createPlaylist = async (req, res) => {
  try {
    const { userId, name, description, songs } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.subscribed) {
      return res.status(403).json({ message: "You need a subscription to create playlists" });
    }

    const newPlaylist = await Playlist.create({ 
      user: userId, 
      name, 
      description: description || "", 
      songs: songs || [] 
    });
    
    // Populate songs to return full song details
    const populatedPlaylist = await Playlist.findById(newPlaylist._id).populate("songs");
    
    res.status(201).json({ message: "Playlist created", playlist: populatedPlaylist });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all playlists of a user
export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.params.userId }).populate("songs");
    res.status(200).json(playlists);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};