import UserSchema from "../Schema/User.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

export const generateUsername = async (email) => {
  let username = email.split("@")[0];
  const existingUserName = await UserSchema.exists({
    "username": username,
  });

  existingUserName ? (username += "-" + nanoid().substring(0, 5)) : "";

  return username;
};

export const formatDataToSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token,
    _id: user._id,
    username: user.username,
    fullname: user.fullname,
    email: user.email,
  };
};
