import Note from "../models/notes.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createNote = asyncHandler(async (req, res) => {
    const { verseId, note } = req.body;
    if (!verseId || !note) {
        throw new ApiError(400, "all fields are required");
    }
    let newNote;
    const existingNote = await Note.findOne({ verseId :verseId });
    if (existingNote) {
        existingNote.note = note;
        await existingNote.save();
        return res.status(200).json(new ApiResponse(200, {note:existingNote },"note updated successfully"));
    }
    else {
         newNote = new Note({
            userId: req.user._id,
            verseId,
            note
        });
        await newNote.save();
    }
   
    res.status(200).json(new ApiResponse(200, { note:newNote },"note created successfully"));
})

const getNotes = asyncHandler(async(req, res) =>{
    const notes = await Note.findOne({userId:req.user._id});
    if (!notes) {
        throw new ApiError(404, "No notes found");
    }
    res.status(200).json(new ApiResponse(200, { notes },"notes fetched successfully"));
})

const getNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
        throw new ApiError(404, "Note not found");
    }
    res.status(200).json(new ApiResponse(200, { note },"note fetched successfully"));
})

const getNoteByVerseId = asyncHandler(async (req, res) => {
    const note=await Note.findOne({ verseId: req.body.verseId });
    if (!note) {
        throw new ApiError(404, "No notes found for this verse");
    }
    res.status(200).json(new ApiResponse(200, { note },"notes fetched successfully"));
})

const updateNote = asyncHandler(async (req, res) => { 
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!note) {
        throw new ApiError(404, "Note not found");
    }
    res.status(200).json(new ApiResponse(200, { note },"note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => { 
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
        throw new ApiError(404, "Note not found");
    }
    res.status(200).json(new ApiResponse(200, { note } ,"Note deleted successfully"));
});

export { createNote, getNotes, getNote, getNoteByVerseId, updateNote, deleteNote };