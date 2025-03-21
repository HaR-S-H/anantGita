import express from "express";
import { getQuizHistory } from "../controllers/quizHistory.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js"
const router = express.Router();

router.get("/", verifyJWT, getQuizHistory);


export default router;