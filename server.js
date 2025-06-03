import "dotenv/config";
import express from "express";
import connectDB from "./db/connectDB.js";
import authRoute from "./routes/auth.routes.js";
import categoryRoute from "./routes/category.routes.js";
import awsRoute from "./routes/aws.routes.js";
import brandRoute from "./routes/brand.routes.js";
import productRoute from "./routes/product.routes.js";
import orderRoute from "./routes/order.routes.js";
import contactRoute from "./routes/contact.routes.js";
import bannerRoute from "./routes/banner.routes.js";
import reviewRoute from "./routes/review.routes.js";
import cors from "cors";

const server = express();
server.use(express.json());
server.use(cors());

server.use("/api/v1/auth", authRoute);
server.use("/api/v1/banner", bannerRoute);
server.use("/api/v1/category", categoryRoute);
server.use("/api/aws", awsRoute);
server.use("/api/v1/brand", brandRoute);
server.use("/api/v1/product", productRoute);
server.use("/api/v1/order", orderRoute);
server.use("/api/v1/contact", contactRoute);
server.use("/api/v1/review", reviewRoute);

let PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  connectDB();
  console.log(`Listing on -> ${PORT}`);
});
