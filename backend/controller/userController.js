import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";

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

    res.status(201).json({
        success: true,
        user
    })
})