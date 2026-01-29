import Chapter from "../models/chapter.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import client from "../redis/connection.js";
const getAllChapters = asyncHandler(async(req, res) => {
    const chapters = await Chapter.find({});
    if (!chapters) {
        throw new ApiError(400, "Chapters not found");
    }
    res.status(200).json(new ApiResponse(200,{chapters},"All chapters fetched successfully"));
})

const getChapter = asyncHandler(async (req, res) => {
    const cacheData = await client.get(`chapter:${req.params.id}`);
    if (cacheData) {
        // console.log(cacheData);
        const chapter = JSON.parse(cacheData);
        // console.log(chapter);
        
        return res.status(200).json(new ApiResponse(200,  {chapter}  , "Chapter fetched from cache"));
    }

    // console.log("hello");
    
    const chapter = await Chapter.findOne({ number: req.params.id }).populate("verses");   
    await client.set(`chapter:${req.params.id}`, JSON.stringify(chapter)); 
    if (!chapter) {
        throw new ApiError(404, "Chapter not found");
    }
    res.status(200).json(new ApiResponse(200,{chapter},"Chapter fetched successfully"));
})

export { getAllChapters, getChapter };