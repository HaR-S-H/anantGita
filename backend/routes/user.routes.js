import express from "express";
import {getUser, updateUser} from "../controllers/user.controllers.js"
import verifyJWT from "../middlewares/auth.middlewares.js"
const router = express.Router();


router.put("/",verifyJWT,updateUser);
router.get("/me",verifyJWT,getUser);


export default router;