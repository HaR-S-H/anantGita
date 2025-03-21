import mongoose from "mongoose";

const verseSchema = new mongoose.Schema({
  verseNumber: {
    type:String,
    required: true,
  },
  text: {
    sanskrit: {
      type: String,
      required: true,
    },
    english: {
      type: String,
      required: true,
    },
    hindi: {
      type: String,
      required: true,
    },
  },
  wordMeanings: [
    {
      word: { type: String },
      meaning: {
        english: String,
        hindi: String,
      },
    },
  ],
  speaker: { type: String, default: "Unknown" }, // Example: Krishna, Arjuna
  audioUrl: { type: String },
  videoUrl: { type: String },
});



const Verse = mongoose.model("Verse", verseSchema);
export {Verse};
