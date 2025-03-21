import Quiz from "../models/quiz.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Progress from "../models/progress.models.js";
import Chapter from "../models/chapter.models.js";
import QuizHistory from "../models/quizHistory.models.js";
const getQuiz = asyncHandler(async (req, res) => {
    let { chapterIds } = req.body; // Expect an array of chapterIds in the request body

    if (!chapterIds || !Array.isArray(chapterIds) || chapterIds.length === 0) {
        throw new ApiError(400, "chapterIds are required and should be an array");
    }

    try {
        // Step 1: Find chapter numbers using chapterIds
        const chapters = await Chapter.find({ _id: { $in: chapterIds } });
        
        if (!chapters.length) {
            throw new ApiError(404, "No chapters found for the given IDs");
        }

        const chapterNumbers = chapters.map(chapter => chapter.number);

        // Step 2: Find quizzes based on the retrieved chapterNumbers
        const quizzes = await Quiz.find({ chapterNumber: { $in: chapterNumbers } });

        if (!quizzes.length) {
            throw new ApiError(404, "No quizzes found for the given chapters");
        }

        res.status(200).json(new ApiResponse(200, { quizzes,chapters }, "Quizzes fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Internal Server Error");
    }
});

const submitQuiz = asyncHandler(async (req, res) => {
    const { answers, quizId } = req.body;
    const userId = req.user._id; // Assuming authentication

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;

    // Generate feedback for each question
    const feedback = quiz.questions.map((question, index) => {
        const isCorrect = answers[index] === question.correctAnswer;
        if (isCorrect) score++;

        return {
            questionText: question.questionText,
            userAnswer: answers[index],
            isCorrect,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation
        };
    });
    let quizHistory = await QuizHistory.findOne({ userId: userId });    
    if (!quizHistory) {
        quizHistory = new QuizHistory({
            userId,
            quizHistory: [
                {
                    quizId,
                    answers: answers,
                    score: score
                }
            ]
         });
    }
    else {
        quizHistory.quizHistory.push({
            quizId,
            answers: answers,
            score: score
        });
    }
    
    await quizHistory.save();
    // Find user's progress
    let progress = await Progress.findOne({ userId });

    if (!progress) {
        progress = new Progress({ userId, quizScores: [] });
    }


        progress.quizScores.push({ quizId, score });


    // Update comprehension score (average of all quiz scores)
    const totalScore = progress.quizScores.reduce((acc, qs) => acc + qs.score, 0);
    const totalAttempts = progress.quizScores.length;
    progress.comprehensionScore = totalAttempts > 0 ? Math.round((totalScore / (totalAttempts * totalQuestions)) * 100) : 0;

    await progress.save();

    res.status(200).json(new ApiResponse(200, { score, feedback,comprehensionScore: progress.comprehensionScore }, "Quiz submitted successfully"));
});


export { submitQuiz, getQuiz };