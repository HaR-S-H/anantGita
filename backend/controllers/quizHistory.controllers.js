import asyncHandler from "../utils/asyncHandler.js";
import QuizHistory from "../models/quizHistory.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
const getQuizHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const quizHistory = await QuizHistory.findOne({ userId: userId });
    if (!quizHistory) {
        throw new ApiError(400, "No Quiz History");
    }
    res.status(200).json(new ApiResponse(200,{quizHistory},"quiz history fetched"));
})

export { getQuizHistory };