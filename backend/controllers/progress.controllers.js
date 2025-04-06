import Progress from "../models/progress.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getProgress = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(400, "userId not found");
    }
    const progress = await Progress.findOne({ userId:userId });
    if (!progress) { 
        throw new ApiError(404, "Progress not found");
    }
    res.status(200).json(new ApiResponse(200,{progress},"progress fetched successfully"));
})

const updateProgress = asyncHandler(async (req, res) => { 
    const userId = req.user._id;
    const { chapterId, verseId, timeSpent } = req.body;
    
    
    if (!userId) {
        throw new ApiError(400, "userId not found");
    }
    let progress = await Progress.findOne({userId:userId});
  
    
    if (!progress) {       
         progress = new Progress({
            userId,
            chaptersCompleted: chapterId?[chapterId] :[],
            versesCompleted: verseId?[verseId]  :[],
            lastStudiedVerse:  verseId || null,
            timeSpent: timeSpent || 0,
            comprehensionScore:0
        });
    }
    else {
        if (chapterId && !progress.chaptersCompleted.includes(chapterId)) {
            progress.chaptersCompleted.push(chapterId);
        }
        else if (chapterId && progress.chaptersCompleted.includes(chapterId)) {
            progress.chaptersCompleted.remove(chapterId);
        }
        if (verseId && progress.versesCompleted.includes(verseId)) {
            progress.versesCompleted.remove(verseId);
        }
        else if (verseId && !progress.versesCompleted.includes(verseId)) {
            progress.versesCompleted.push(verseId);
        }
        if (verseId) {
            progress.lastStudiedVerse = verseId;
        }
        progress.timeSpent += timeSpent || 0;
        progress.lastAccessedAt = new Date();
    }    
    await progress.save();

    res.status(200).json(new ApiResponse(200, { progress }, "progress updated successfully"));
})

const deleteProgress = asyncHandler(async (req, res) => { 
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(400, "userId not found");
    }
    const progress = await Progress.findOneAndDelete({ userId });
    if (!progress) {
        throw new ApiError(404, "Progress not found"); 
    }
    res.status(200).json(new ApiResponse(200, {progress}, "progress deleted successfully"));
});

export { getProgress, updateProgress,deleteProgress };