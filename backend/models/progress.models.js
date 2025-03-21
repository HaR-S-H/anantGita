import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    chaptersCompleted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chapter"
        }
    ],
    versesCompleted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Verse"
        }
    ],
    lastStudiedVerse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Verse"
    },
    timeSpent: Number, // in minutes
    quizScores: [
        {
            quizId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Quiz",
                required: true
            },
            score: {
                type: Number, // Store score as a number
                min: 0
            }
        }
    ],
    comprehensionScore: {
        type: Number,
        min: 0,
        max: 100
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    }
});

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
