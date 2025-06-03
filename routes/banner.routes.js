import express from "express";
import {
  uploadBanner,
  deleteBanner,
  getAllBanner,
  updateBannerAltText,
  updateBannerImg,
} from "../controllers/banner.controller.js";

const router = express.Router();

router.route("/upload-banner").post(uploadBanner);
router.route("/delete-banner").delete(deleteBanner);
router.route("/update-banner-image-alt-text").post(updateBannerAltText);
router.route("/update-banner-image").post(updateBannerImg);
router.route("/get-all-banners").get(getAllBanner);

export default router;
