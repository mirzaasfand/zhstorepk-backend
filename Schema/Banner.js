import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  imageURL: { type: String, required: true },
  bannerImageAltText: { type: String, required: true },
});

export default mongoose.model("Banner", bannerSchema);
