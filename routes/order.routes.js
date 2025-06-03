import express from "express";
import { Order, getOrdersByUser, updateOrderStatus, getAllOrders, deleteOrder } from "../controllers/order.controller.js";
import { verifyJWT } from './../middleware/auth.middleware.js';

const router = express.Router();

router.route("/order").post(Order);
router.get("/get-orders-by-user", verifyJWT, getOrdersByUser);
router.route("/get-all-orders").get(getAllOrders);
router.route("/update-order-status").post(updateOrderStatus);
router.route("/delete-order").delete(deleteOrder);

export default router;
