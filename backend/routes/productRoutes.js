import express from "express";
import { createProducts, getAllProducts } from "../controller/productController.js";

const router = express.Router();


// Routes
router.route("/products").get(getAllProducts).post(createProducts);


export default router;
