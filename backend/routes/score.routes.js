import express from "express";
import { calculateScore,comprehensionScore } from "../controllers/score.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js"
const router = express.Router();

router.post("/", verifyJWT, calculateScore);
router.put("/",verifyJWT,comprehensionScore);


export default router;