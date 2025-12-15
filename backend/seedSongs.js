import mongoose from "mongoose";
import dotenv from "dotenv";
import Song from "./models/Song.js";

dotenv.config();

const sampleSongs = [
  {
    title: "Sample Song 1",
    artist: "Artist 1",
    album: "Album 1",
    duration: 180,
    url: "/uploads/songs/sample1.mp3",
    coverArt: "https://picsum.photos/220/180?random=1"
  },
  {
    title: "Sample Song 2",
    artist: "Artist 2",
    album: "Album 2",
    duration: 200,
    url: "/uploads/songs/sample2.mp3",
    coverArt: "https://picsum.photos/220/180?random=2"
  }
];

const seedSongs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    await Song.deleteMany({});
    console.log("Cleared existing songs");

    await Song.insertMany(sampleSongs);
    console.log("Sample songs added!");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding songs:", err);
    process.exit(1);
  }
};

seedSongs();