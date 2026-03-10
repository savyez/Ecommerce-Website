import express from "express";
import { getAllProducts } from "../controller/productController.js";

const router = express.Router();


// Routes
router.route("/products").get(getAllProducts);


export default router;
