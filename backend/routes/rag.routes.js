import express from "express";
import { getRag,createRag } from "../controllers/rag.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js"
const router = express.Router();

router.get("/", verifyJWT, getRag);
router.post("/",verifyJWT,createRag);


export default router;