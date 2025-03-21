import mongoose from "mongoose";
const quizSchema = new mongoose.Schema({
    chapterNumber: {
        type: Number,
        requried:true
    },
    questions: [{
      questionText: {
        type: String,
        required: true
      },
        options: [{
            text: String,
        }],
        correctAnswer: {type:String, required: true},
      explanation: String,
    }]
});
  

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
  