import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    isStore: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "submitAt",
    },
  }
);

export default mongoose.model("Contact", contactSchema);
