import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";


// Create new Order
export const createNewOrder = handleAsyncError(async(req, res, next) => {
    const {
        shippingInfo,
        shipingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo: shippingInfo || shipingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order
    });
});


// Getting All order or the loggedIn user
export const allMyOrders = handleAsyncError(async(req, res, next) => {
    const order = await Order.find({ user: req.user._id });
    
    if(order.length === 0) {
        return next(new HandleError("No Order Found", 404))
    }
    
    res.status(200).json({
        success: true,
        order
    });
});


//  Admin - Get single Order
export const getSingleOrder = handleAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if(!order) {
        return next(new HandleError("Order Not Found", 404))
    }
    res.status(200).json({
        success: true,
        order
    });
})


// Admin - Getting all orders
export const getAllOrders = handleAsyncError(async(req, res, next) => {
    const orders = await Order.find();
    if(orders.length === 0) {
        return next(new HandleError("Order Not Found", 404))
    }
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        orders,
        totalAmount
    });
})