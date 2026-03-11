import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        maxlength: [25, "Invalid name. Name is more than 25 characters"],
        minLength: [3, "Invalid name. Name is less than 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password"],
        minLength: [8, "Password should be at least 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date   
}, {
    timestamps: true
})

// Password hashing
userSchema.pre("save", async function(next) {
    this.password = await bcryptjs.hash(this.password, 10)

    // If User updates profile do not hash the password again
    // If User updates the password then we'll hash the new password
    if(!this.isModified("password")) {
        return next();
    }

})

export default mongoose.model("User", userSchema);