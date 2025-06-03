import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    address: {
      country: String,
      firstName: String,
      email: String,
      lastName: String,
      address: String,
      city: String,
      postalCode: String,
      phoneNumber: String,
    },
    differentShippingAddress: {
      firstName: String,
      email: String,
      lastName: String,
      address: String,
      city: String,
      postalCode: String,
      phoneNumber: String,
    },
    products: [],
    paymentMethod: String,
    totalPrice: Number,
    status: String,
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

export default mongoose.model("order", orderSchema);
