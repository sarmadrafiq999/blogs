import mongoose from "mongoose";

const FavouriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },        // who favourites
  writerId: { type: String, required: true },      // favourited writer
  writerName: { type: String },
  writerEmail: { type: String },
  writerImage: { type: String },
});

export default mongoose.models.Favourite || mongoose.model("Favourite", FavouriteSchema);
