import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.model("Review", reviewSchema);
