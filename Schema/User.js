import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      lowercase: true,
      required: true,
      minlength: [3, "fullname must be 3 letters long"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: String,
    username: {
      type: String,
      minlength: [3, "Username must be 3 letters long"],
      unique: true,
    },
    role: {
      type: Boolean,
      default: false,
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

export default mongoose.model("users", userSchema);
