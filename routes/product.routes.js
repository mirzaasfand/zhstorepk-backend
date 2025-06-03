import express from "express";
import { addProduct, updateProduct, deleteProduct, getAllProducts, getProductBySlug, searchEngine } from './../controllers/product.controller.js';

const router = express.Router();

router.route("/add-product").post(addProduct);
router.route("/update-product").post(updateProduct);
router.route("/delete-product").delete(deleteProduct);
router.route("/get-all-product").get(getAllProducts);
router.route("/get-searched-product").get(searchEngine);
router.route("/get-product-by-slug").get(getProductBySlug);

export default router;
