import mongoose from "mongoose";

const ragModel = new mongoose.Schema({
   userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    queries: [{
        queryText: {
            type: String,
            required: true,
        },
        responseText: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
})

const Rag = mongoose.model('Rag', ragModel);

export default Rag;