import express from "express";
import { getQuiz,submitQuiz } from "../controllers/quiz.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js"
const router = express.Router();

router.post("/", verifyJWT, getQuiz);
router.post("/submit",verifyJWT,submitQuiz);


export default router;