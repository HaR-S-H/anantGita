import express from "express";
import { getNote,createNote,getNoteByVerseId,getNotes,updateNote,deleteNote } from "../controllers/note.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js"
const router = express.Router();

router.get("/", verifyJWT, getNotes);
router.post("/verse", verifyJWT, getNoteByVerseId);
router.get("/:id",verifyJWT,getNote);
router.post("/",verifyJWT,createNote);
router.put("/:id",verifyJWT,updateNote);
router.delete("/:id",verifyJWT,deleteNote);


export default router;