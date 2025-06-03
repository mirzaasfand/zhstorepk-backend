import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productInfo: {
      name: { type: String },
      slug: { type: String },
      description: { type: String },
      tags: { type: String },
      variation: { type: Array },
      ytVideoURL: { type: String },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
      brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
      },
    },
    images: {
      mainImg: { type: String },
      mainImgAltText: { type: String },
      backImg: { type: String },
      backImgAltText: { type: String },
      galleryImgs: { type: Array },
      variationImgs: { type: Array },
    },
    price: {
      price: { type: Number },
      discountedPrice: { type: Number },
    },
    stock: {
      available: { type: Number },
      sold: { type: Number },
    },
    seo: {
      seoTitle: { type: String },
      seoDescription: { type: String },
      seoTags: { type: String },
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

export default mongoose.model("Product", ProductSchema);
