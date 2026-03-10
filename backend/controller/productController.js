import Product from "../models/productModel.js"


// Creating Products
export const createProducts = async(req, res) => {
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
}



export const getAllProducts = (req,res) => {
    res.status(200)
        .json({
            message: "All products"
        })
}
