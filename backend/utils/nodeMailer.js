import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const sendOTP = async (email, otp) => {
    try {
        console.log(email,otp);
        console.log(process.env.EMAIL_PASS);
        console.log(process.env.EMAIL_USER);
        
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

        const response = await transporter.sendMail(mailOptions);
        console.log(response);
        
    } catch (error) {
        console.log(error);
        
    }
};

export default sendOTP;
