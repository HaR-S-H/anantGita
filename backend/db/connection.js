import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connectedDB = async () => {
    try {
        // console.log(process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL); 
        console.log(process.env.MONGODB_URL);
        
        console.log("MONGODB CONNECTED");
        
    } catch (error) {
        console.log("MONGODB connection error",error);
        
    }
}

export default connectedDB;