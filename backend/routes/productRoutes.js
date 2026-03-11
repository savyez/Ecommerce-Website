import express from "express";
import { createProducts, deleteProduct, getAllProducts, updateProduct } from "../controller/productController.js";

const router = express.Router();


// Routes
router.route("/products").get(getAllProducts).post(createProducts);
router.route("/product/:id").put(updateProduct).delete(deleteProduct);

export default router;
