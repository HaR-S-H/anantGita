import express from "express";
import { getAllChapters, getChapter } from "../controllers/chapter.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js"
const router = express.Router();

router.get("/", verifyJWT, getAllChapters);
router.get("/:id",verifyJWT,getChapter);


export default router;