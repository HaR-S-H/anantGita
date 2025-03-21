import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other"
    },
    avatar: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date
    }
}, { timestamps: true });

userSchema.pre('save',async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) { 
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name:this.name
    }, process.env.ACCESS_TOKEN_SECRET,
        {
       expiresIn:process.env.ACCESS_TOKEN_EXPIRY
   })
}

const User = new mongoose.model("User", userSchema);

export default User;