import asyncHandler from "../utils/asyncHandler.js";
import { Verse } from "../models/verse.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
const getAllVerses = asyncHandler(async (req, res) => {
    const verses = await Verse.find({});
    if (!verses) {
        throw new ApiError(404,"Verses not found");
    }
    res.status(200).json(new ApiResponse(200, { verses }, "All verser fetched successfully"));
})

const getVerse = asyncHandler(async (req, res) => { 
    const verse = await Verse.findById(req.params.id);
    if (!verse) {
        throw new ApiError(404, "Verse not found");
    }
    res.status(200).json(new ApiResponse(200, { verse }, "Verse fetched successfully"));
});

const updateVerse=async (req,res) => {
    try {
        const verse = await Verse.findByIdAndUpdate(req.params.id,req.body);
        if (!verse) {
            console.log('he');
            
            throw new Error("Verse not found");
        }
        console.log(verse);
        
        verse.verseNumber = 1.30;
        await verse.save();
        res.status(200).json({verse});
    } catch (error) {
        console.log(error);
        
    }
}
export { getAllVerses, getVerse ,updateVerse};