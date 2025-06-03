import express from "express";
import { verifyJWT } from './../middleware/auth.middleware.js';
import {
  Signup,
  Signin,
  GoogleAuth,
  getAllUsers,
  deleteUser,
  getUserById,
  updateName,
  updatePassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/signup").post(Signup);
router.route("/signin").post(Signin);
router.route("/google-auth").post(GoogleAuth);
router.route("/get-all-users").get(getAllUsers);
router.route("/delete-user").delete(deleteUser);
router.get("/get-user-by-id", verifyJWT, getUserById);
router.post("/update-name", updateName);
router.post("/update-password", updatePassword);

export default router;
