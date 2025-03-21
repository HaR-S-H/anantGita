import mongoose from "mongoose";

const QuizHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizHistory: [
        {
            quizId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Quiz',
                required: true
            },
            answers: {
                type: Array, // Stores an array of selected answers
                required: true
            },
            score: {
                type: Number,
                required: true
            }
        }
    ]
});

const QuizHistory = mongoose.model('QuizHistory', QuizHistorySchema);

export default QuizHistory;
