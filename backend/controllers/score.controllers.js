import Quiz from "../models/quiz.models.js";
import Progress from "../models/progress.models.js";
import asyncHandler from "../utils/asyncHandler.js";

const calculateScore = asyncHandler(async (req, res) => {
  
    
    const progress = await Progress.findOne({ userId: req.user._id });
    progress.quizScore.push({ quizId, score: score });
    await progress.save();
});

const comprehensionScore = asyncHandler(async (req, res) => {
    const progress = await Progress.findOne({ userId: req.user._id });
    const totalScore = progress.quizScore.reduce((acc, quiz) => acc + (quiz.score || 0), 0);
    progress.comprehensionScore = totalScore/progress.quizScore.length;
    await progress.save();
})

export { calculateScore, comprehensionScore };