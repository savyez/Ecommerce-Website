import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";


// Creating Products
export const createProducts = handleAsyncError(async (req, res, next) => {
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})


// Get all Products
export const getAllProducts = handleAsyncError(async (req,res, next) => {
    const resultsPerPage = 3
    const apiFeatures = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

    //  Getting filtered query before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    const totalPages = Math.ceil(productCount/ resultsPerPage);
    const page = Number(req.query.page) || 1;

    if (page > totalPages && productCount > 0) {
        return next(new HandleError(`This page doesn't exist`, 404))
    }
    apiFeatures.pagination(resultsPerPage);

    const products = await apiFeatures.query;
    if(!products || products.length === 0) {
        return next (new HandleError("No Products Found", 404))
    }
    res.status(200)
        .json({
            success:true,
            products,
            productCount,
            resultsPerPage,
            totalPages,
            currentPage: page
        })
})


// Update product
export const updateProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!product) {
        return next(new HandleError("Product Not Found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})


//  Delete Product
export const deleteProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
        return next(new HandleError("Product Not Found", 404))
    }
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })
})


// Accessing Single Product
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new HandleError("Product Not Found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})


// Creating and Updating Review
export const createReviewForProduct = handleAsyncError(async (req, res, next) => {
    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)
    const reviewExists = product.reviews.find(review => review.user.toString() === req.user.id);

    if(reviewExists) {
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user.id.toString()){
                review.rating = rating;
                review.comment = comment;                
            }
        })
    } else {
        product.reviews.push(review)
    }
    product.numOfReviews = product.reviews.length
    
    let sum = 0;
    product.reviews.forEach(review => {
        sum += review.rating
    })

    product.ratings= product.reviews.length>0? sum/product.reviews.length: 0;


    await product.save({validateBeforeSave: false})
    res.status(200).json({
        success: true,
        product
    })
})


// Getting all products for Admin
export const getAdminProducts = handleAsyncError(async(req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
})