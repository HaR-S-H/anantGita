import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true
      },
      name: {
        // sanskrit: {
        //   type: String,
        //   required: true
        // },
        english: {
          type: String,
          required: true
        },
    //     hindi: {
    //       type: String,
    //       required: true
    //     }
      },
      totalVerses: {
        type: Number,
        required: true
  },
    verses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Verse" }], 
},{timestamps:true});

const Chapter = mongoose.model('Chapter', chapterSchema);

export default Chapter;