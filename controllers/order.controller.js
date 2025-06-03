import OrderModel from "../Schema/order.js";
import mongoose from "mongoose";

export const Order = async (req, res) => {
  try {
    const {
      user,
      products,
      country,
      firstName,
      lastName,
      email,
      address,
      city,
      postalCode,
      phoneNumber,
      diffFirstName,
      diffLastName,
      diffEmail,
      diffAddress,
      diffCity,
      diffPostalCode,
      diffPhoneNumber,
      paymentMethod,
      totalPrice,
      status,
    } = req.body;

    if (
      !products ||
      !country ||
      !firstName ||
      !lastName ||
      !email ||
      !address ||
      !city ||
      !postalCode ||
      !phoneNumber ||
      !paymentMethod ||
      !totalPrice ||
      !status
    ) {
      return res.send({
        success: false,
        message: "Please fill all the fields!",
      });
    }

    if (!user) {
      const order = new OrderModel({
        products,
        "address.country": country,
        "address.firstName": firstName,
        "address.lastName": lastName,
        "address.email": email,
        "address.address": address,
        "address.city": city,
        "address.postalCode": postalCode,
        "address.phoneNumber": phoneNumber,
        "differentShippingAddress.firstName": diffFirstName,
        "differentShippingAddress.lastName": diffLastName,
        "differentShippingAddress.email": diffEmail,
        "differentShippingAddress.address": diffAddress,
        "differentShippingAddress.city": diffCity,
        "differentShippingAddress.postalCode": diffPostalCode,
        "differentShippingAddress.phoneNumber": diffPhoneNumber,
        paymentMethod,
        totalPrice,
        status: "pending",
      });

      await order.save();
    } else {
      const order = new OrderModel({
        user,
        products,
        "address.country": country,
        "address.firstName": firstName,
        "address.lastName": lastName,
        "address.email": email,
        "address.address": address,
        "address.city": city,
        "address.postalCode": postalCode,
        "address.phoneNumber": phoneNumber,
        "differentShippingAddress.firstName": diffFirstName,
        "differentShippingAddress.lastName": diffLastName,
        "differentShippingAddress.email": diffEmail,
        "differentShippingAddress.address": diffAddress,
        "differentShippingAddress.city": diffCity,
        "differentShippingAddress.postalCode": diffPostalCode,
        "differentShippingAddress.phoneNumber": diffPhoneNumber,
        paymentMethod,
        totalPrice,
        status: "pending",
      });

      await order.save();
    }

    return res
      .status(200)
      .send({ success: true, message: "Order Pleased Successfully!" });
  } catch (error) {
    return res.status(501).send({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    let { page = 1, query } = req.query;
    page = parseInt(page);
    const maxLimit = 12;

    let filter = {};
    const isValidObjectId = mongoose.Types.ObjectId.isValid(query);

    if (query && query.trim() !== "") {
      const orConditions = [
        { "address.firstName": { $regex: query, $options: "i" } },
        { "address.lastName": { $regex: query, $options: "i" } },
        { "address.email": { $regex: query, $options: "i" } },
        { "address.address": { $regex: query, $options: "i" } },
        { "address.city": { $regex: query, $options: "i" } },
        { "address.postalCode": { $regex: query, $options: "i" } },
        { "address.phoneNumber": { $regex: query, $options: "i" } },

        {
          "differentShippingAddress.firstName": {
            $regex: query,
            $options: "i",
          },
        },
        {
          "differentShippingAddress.lastName": { $regex: query, $options: "i" },
        },
        { "differentShippingAddress.email": { $regex: query, $options: "i" } },
        {
          "differentShippingAddress.address": { $regex: query, $options: "i" },
        },
        { "differentShippingAddress.city": { $regex: query, $options: "i" } },
        {
          "differentShippingAddress.postalCode": {
            $regex: query,
            $options: "i",
          },
        },
        {
          "differentShippingAddress.phoneNumber": {
            $regex: query,
            $options: "i",
          },
        },

        { paymentMethod: { $regex: query, $options: "i" } },
        { status: { $regex: query, $options: "i" } },
      ];

      if (isValidObjectId) {
        orConditions.unshift({ _id: new mongoose.Types.ObjectId(query) });
      }

      filter = { $or: orConditions };
    }

    const orders = await OrderModel.find(filter)
      .populate("user")
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);

    if (orders && orders.length > 0) {
      return res.status(200).json({ success: true, orders });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Order not found!", orders: [] });
    }
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: error.message,
    });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    let id = req.user;

    const orders = await OrderModel.find({ user: id });
    if (orders) {
      return res.status(200).json({ success: true, orders });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Order not found!", orders });
    }
  } catch (error) {
    return res.status(501).send({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, orderId } = req.body;

    if (!status || !orderId) {
      return res.send({
        success: false,
        message: "Something is missing! Contact to support",
      });
    }

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        status: status,
      },
      { new: true }
    );

    if (order) {
      return res.send({ success: true, message: `${status} Successfully!` });
    } else {
      return res.send({ success: false, message: `Not found!` });
    }
  } catch (error) {
    return res.status(501).send({ success: false, message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.query;
    if (!orderId) {
      return res.send({ success: false, message: `Order Id is missing!` });
    }

    const orderDelete = await OrderModel.findByIdAndDelete(orderId);

    if (!orderDelete) {
      return {
        success: false,
        message: "Something went wrong!",
      };
    }

    return res
      .status(200)
      .send({ success: true, message: `Deleted Successfully!` });
  } catch (error) {
    return res.status(501).send({ success: false, message: error.message });
  }
};
