import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.route("/create-category").post(createCategory);
router.route("/delete-category").delete(deleteCategory);
router.route("/update-category").post(updateCategory);
router.route("/get-all-category").get(getAllCategory);

export default router;
