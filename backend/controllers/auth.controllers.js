import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.models.js";
import crypto from "crypto";
import axios from "axios";
import sendOTP from "../utils/nodeMailer.js";
import oauth2Client from "../utils/googleClient.js";
import gravatar from "gravatar"
import { log } from "console";
const registeUser = asyncHandler(async(req, res) =>{
    const { name, email, password,gender } = req.body;
    if (!name || !email || !password || !gender) {
        throw new ApiError(400,"All fields are required",);
    }
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
        throw new ApiError(400, "Email already exists");
    }
    
    // console.log(existingUserWithName);
    
    // let avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(avatarLocalPath);
    
    // let avatarUrl;
    // if (avatarLocalPath) { 
        
    //     avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    //     avatarUrl = avatarUrl.url;
    // }
    // else {
        // avatarUrl = gender == "male" ? 'https://res.cloudinary.com/dvlkfh2dl/image/upload/v1734186628/male_eo8sx9.jpg' : 'https://res.cloudinary.com/dvlkfh2dl/image/upload/v1734186791/female_vcgpxa.png';
    // }
    // console.log(avatarLocalPath);
    // if (!avatarUrl) { 
    //     throw new ApiError(500, "Error uploading avatar to cloudinary");
    // }
    console.log(email.trim().toLowerCase());
    const avatarUrl = gravatar.url(email.trim().toLowerCase(), {
    s: '200',
    d: 'identicon',
    r: 'pg'
}, true);
    console.log(avatarUrl);
    const newUser = new User({
        name:name.toLowerCase(),
        email,
        password,
        avatar: avatarUrl,
        gender
    })
    const otp = crypto.randomInt(100000, 999999).toString();
    newUser.otp = otp;
    newUser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await newUser.save();
    await sendOTP(email, otp);
    // const token = newUser.generateAccessToken();
    // return res.status(201).cookie("token", token).json(
    //     new ApiResponse(200, { newUser, token }, "user successfully registered")
    // )
    res.status(201).json(new ApiResponse(200, "OTP sent to email. Verify your account."));
})

const verifyUser = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;    
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "User not registered");
    }
    if (user.isVerified) return res.status(400).json({ msg: "User already verified" });
    if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json(new ApiResponse(400,"invalid or expired OTP"));
    }
    user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
    await user.save();
    const token = user.generateAccessToken();
    return res.status(201).cookie("token", token).json(
        new ApiResponse(200, { user, token }, "user successfully registered")
    )
});


const logInUser = asyncHandler(async (req, res) => {
    
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new ApiError(401, "user not registered");
    }
    const isMatch = await existingUser.isPasswordCorrect(password);

    if (!isMatch) {
        throw new ApiError(401, "invalid password");
    }
    console.log(req.body)
    const token = existingUser.generateAccessToken();
   const cookieOptions = {
      httpOnly: true,
  secure: true,
  sameSite: 'strict', // 'strict' or 'lax' based on your requirements
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    return res
        .status(200)
        .cookie("token", token, cookieOptions)
        .json(new ApiResponse(200, {user:existingUser, token}, "user logged in successfully"));
})


const logOutUser = asyncHandler(async (req, res) => { 
    return res.status(200).clearCookie("token").json(new ApiResponse(200, {}, "user logged out successfully"));
})

const googleAuth = asyncHandler(async (req, res) => { 
  
    
        const code = req.query.code;
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
    const { email, name, picture } = userRes.data;
    // console.log(picture);
    
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name,
                email,
                avatar: picture,
                isVerified: true,
             
            })
            await user.save();
    }
        const token = user.generateAccessToken();
        return res.status(201).cookie("token", token).json(
            new ApiResponse(200, { user, token }, "user successfully registered")
        )
});
const resendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "User not registered");
    }
    if (user.isVerified) return res.status(400).json({ msg: "User already verified" });
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();
    await sendOTP(email, otp);
    res.status(201).json(new ApiResponse(200, "OTP sent to email. Verify your account."));
})
const forgetPasswordSendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "User not registered");
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    // user.isVerified = false;
    await user.save();
    await sendOTP(email, otp);
    res.status(200).json(new ApiResponse(200, "OTP send to you email"));
})
const forgetPasswordVerifyUser = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "User not registered");
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json(new ApiResponse(400,"invalid or expired OTP"));
    }
    user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
    await user.save();
    const token = user.generateAccessToken();
    return res.status(201).cookie("token", token).json(
        new ApiResponse(200, { user, token }, "user successfully registered")
    )
})
const forgetPasswordResetPassword = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!(email == req.user.email)) {
        throw new ApiError(400, "You are authorized to reset password");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "User not registered");
    }
    user.password = password;
    await user.save();
    res.status(200).json(new ApiResponse(200, {user},"password reset successfully"));
})
export {
    registeUser,logInUser,logOutUser,verifyUser,googleAuth,resendOtp,forgetPasswordSendOTP,forgetPasswordVerifyUser,forgetPasswordResetPassword
}