import express from "express";
import { getAllVerses,getVerse,updateVerse } from "../controllers/verse.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js"
const router = express.Router();

router.get("/", verifyJWT, getAllVerses);
router.get("/:id",verifyJWT,getVerse);
router.put("/:id",updateVerse);


export default router;