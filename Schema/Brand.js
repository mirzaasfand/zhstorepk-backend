import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
});

export default mongoose.model("Brand", brandSchema);
