import express from "express";
import { getUploadURL } from "../controllers/aws.controller.js";

const router = express.Router();

router.route("/get-upload-url").get(getUploadURL);

export default router;
