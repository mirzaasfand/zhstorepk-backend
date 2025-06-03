import express from "express";
import { addBrand, deleteBrand, getAllBrands, updateBrandImg, updateBrandName } from "../controllers/brand.controller.js";

const router = express.Router();

router.route("/add-brand").post(addBrand);
router.route("/delete-brand").delete(deleteBrand);
router.route("/update-brand-image").post(updateBrandImg);
router.route("/update-brand-name").post(updateBrandName);
router.route("/get-all-brands").get(getAllBrands);

export default router;
