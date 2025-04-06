import mongoose from "mongoose";

const timeSpentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sunday: {
        type: Number,
        default: 0
    },
    monday: {
        type: Number,
        default: 0
    },
    tuesday: {
        type: Number,
        default: 0
    },
    wednesday: {
        type: Number,
        default: 0
    },
    thursday: {
        type: Number,
        default: 0
    },
    friday: {
        type: Number,
        default: 0
    },
    saturday: {
        type: Number,
        default: 0
    },
 
}, { timestamps: true });

const timeSpent = mongoose.model("timeSpent", timeSpentSchema);

export default timeSpent;