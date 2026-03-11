import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js"


// Register User
export const registerUser = handleAsyncError (async (req, res, next) => {
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "This is a temp id",
            url: "This is a temp id"
        }
    })
    sendToken(user, 201, res)
})


// Login 
export const loginUser = handleAsyncError (async (req, res, next) => {

    const {email, password} = req.body;
    if (!email || !password) {
        return next (new HandleError("Email or password cannot be empty", 400))
    }

    const user = await User.findOne({email}).select("+password");
    if(!user) {
        return next (new HandleError("Invalid Email or  password", 401))
    }

    const isValidPassword = await user.verifyPassword(password);
    if(!isValidPassword) {
        return next (new HandleError("Invalid Email or Password", 401))
    }
    
    sendToken(user, 200, res)
})


// Logout
export const logout = handleAsyncError(async (req, res, next) => {
    res.cookie("token", null,{expires: new Date(Date.now()) , httpOnly: true})
    res.status(200).json({
        success: false,
        message: "User Logged Out Successfully"
    })
})