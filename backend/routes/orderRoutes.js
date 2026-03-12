import express from "express";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
import { allMyOrders, createNewOrder, getAllOrders, getSingleOrder } from "../controller/orderController.js";

const router = express.Router();

router.route('/new/order').post(verifyUserAuth, createNewOrder);
router.route('/admin/order/:id').get(verifyUserAuth,roleBasedAccess("admin"), getSingleOrder);
router.route('/admin/orders').get(verifyUserAuth,roleBasedAccess("admin"), getAllOrders);
router.route('/orders/user').get(verifyUserAuth, allMyOrders);


export default router;