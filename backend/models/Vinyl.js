import mongoose from "mongoose";

const vinylSchema = new mongoose.Schema(
  {
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    vinylImage: {
      type: String,
      default: "https://placehold.co/300x300?text=Vinyl",
    },
  },
  { timestamps: true }
);

const Vinyl = mongoose.model("Vinyl", vinylSchema);
export default Vinyl;