import UserModel from "../Schema/User.js";
import bcrypt from "bcrypt";
import { formatDataToSend, generateUsername } from "../helper/auth.helper.js";
import admin from "firebase-admin";
import { serviceAccountKey } from "../watch-website-832fd-firebase-adminsdk-fbsvc-e3b17fd19b.js";
import { getAuth } from "firebase-admin/auth";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

export const Signup = async (req, res) => {
  try {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.send({
        success: false,
        message: "Please fill all the fields!",
      });
    }

    if (fullname.length < 3) {
      return res.send({
        success: false,
        message: "Full Name Must be 3 Character Long!",
      });
    }

    if (!emailRegex.test(email)) {
      return res.send({ success: false, message: "Invalid Email Address!" });
    }

    if (!passwordRegex.test(password)) {
      return res.send({
        success: false,
        message:
          "Password must be 6 to 20 character long with a numerical, 1 uppercase and 1 lowercase letters",
      });
    }

    const existingEmail = await UserModel.exists({
      email: email,
    });
    if (existingEmail) {
      return res.send({
        success: false,
        message: "Email is Already Register! Login",
      });
    }

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error occurred while creating an account! Try Again",
        });
      }

      let username = await generateUsername(email);

      const user = await new UserModel({
        fullname,
        email,
        password: hashedPassword,
        username,
      });

      user.save();

      return res.status(200).send(formatDataToSend(user));
    });
  } catch (error) {
    return res.status(501).send({ success: false, message: error.message });
  }
};

export const Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({
        success: false,
        message: "Please fill all the fields!",
      });
    }

    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.send({
        success: false,
        message: "Email Or Password is Incorrect!",
      });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error occurred while finding an account! Try Again",
        });
      }

      if (!result) {
        return res.send({
          success: false,
          message: "Email Or Password is Incorrect!",
        });
      } else {
        return res.status(200).send(formatDataToSend(user));
      }
    });
  } catch (error) {
    return res.status(501).send({ success: false, message: error.message });
  }
};

export const GoogleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;

    const decodedUser = await getAuth().verifyIdToken(access_token);
    let { email, name } = decodedUser;

    let user = await UserModel.findOne({
      email: email,
    }).select("fullname username google_auth");

    if (user) {
      if (!user.google_auth) {
        return res.status(403).json({
          success: false,
          message:
            "This email was signed up without Google. Please login with password to access the account!",
        });
      }
    } else {
      const username = await generateUsername(email);
      user = new UserModel({
        fullname: name,
        email,
        username,
        google_auth: true,
      });

      try {
        user = await user.save();
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    }

    return res.status(200).send(formatDataToSend(user));
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message:
        "Failed to authenticate with Google. Please try another account.",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    let { _id } = req.query;

    const user = await UserModel.findByIdAndDelete(_id);

    return res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(501).send({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    let id = req.user;

    const user = await UserModel.find({ _id: id });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(501).send({ success: false, message: error.message });
  }
};

export const updateName = async (req, res) => {
  try {
    const { fullName, userId } = req.body;
    if (!fullName) {
      return res.send({
        success: false,
        message: "Please Enter Your Full Name!",
      });
    }

    if (fullName.length < 3) {
      return res.send({
        success: false,
        message: "Full Name must be 3 character long!",
      });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { fullname: fullName },
      { new: true }
    );

    if (user) {
      return res.status(200).send({
        success: true,
        message: `Full Name Updated Successfully!`,
        user,
      });
    } else {
      return res.send({
        success: false,
        message: `user not found!`,
      });
    }
  } catch (error) {
    return res.status(501).send({ success: false, message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password, userId } = req.body;

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (!passwordRegex.test(password)) {
      toast.dismiss(loading);
      return toast.error(
        "Password must be 6 to 20 character long with a numerical, 1 uppercase and 1 lowercase letters"
      );
    }

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error occurred while creating an account! Try Again",
        });
      }
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true }
      );

      if (user) {
        return res.status(200).send({
          success: true,
          message: `Password Updated Successfully!`,
          user,
        });
      } else {
        return res.send({
          success: false,
          message: `user not found!`,
        });
      }
    });
  } catch (error) {
    return res.status(501).send({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let { page = 1, query } = req.query;
    page = parseInt(page);
    const maxLimit = 10;
    let filter = {};

    if (query && query.trim() !== "") {
      filter = {
        $or: [
          { fullname: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { username: { $regex: query, $options: "i" } },
        ],
      };
    }
    
    const users = await UserModel.find(filter)
    .sort({ publishedAt: -1 })
    .select("fullname email username role google_auth joinedAt _id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit);
    
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res
      .status(501)
      .json({ success: false, message: error.message, error });
  }
};
