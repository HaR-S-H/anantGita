import express from "express";
import { registeUser, logInUser, logOutUser, verifyUser, googleAuth, resendOtp, forgetPasswordResetPassword,forgetPasswordSendOTP,forgetPasswordVerifyUser } from "../controllers/auth.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.post("/signup", registeUser);
router.post("/login",logInUser);
router.post("/logout", logOutUser);
router.post("/verify", verifyUser);
router.post("/reverify",resendOtp);
router.post("/forgetpasswordresetpassword",verifyJWT,forgetPasswordResetPassword);
router.post("/forgetpasswordsendotp",forgetPasswordSendOTP);
router.post("/forgetpasswordverifyuser",forgetPasswordVerifyUser);
router.get("/google", googleAuth);

export default router;