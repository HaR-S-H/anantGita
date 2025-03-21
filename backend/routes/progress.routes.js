import express from "express";
import { getProgress,updateProgress ,deleteProgress} from "../controllers/progress.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js"
const router = express.Router();

router.get("/", verifyJWT, getProgress);
router.post("/",verifyJWT,updateProgress);
router.delete("/",verifyJWT,deleteProgress);


export default router;