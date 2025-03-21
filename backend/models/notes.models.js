import mongoose from "mongoose";
const NotesSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    verseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Verse',
      required: true
    },
    note: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});
  
const Note = mongoose.model('UserNote', NotesSchema);

export default Note;