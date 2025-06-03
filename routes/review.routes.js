import express from "express";
import { addReview, deleteReview, getAllReview, getReviewByProduct, getRatingByProduct } from "../controllers/review.controller.js";

const router = express.Router();

router.route("/add-review").post(addReview);
router.route("/delete-review").delete(deleteReview);
router.route("/get-reviews-by-product").post(getReviewByProduct);
router.route("/get-rating-by-product").post(getRatingByProduct);
router.route("/get-all-review").get(getAllReview);

export default router;
