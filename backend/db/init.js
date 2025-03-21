import xlsx from "xlsx";
import mongoose from "mongoose";
import Chapter from "../models/chapter.models.js";
import { Verse } from "../models/verse.models.js";
import Quiz from "../models/quiz.models.js";
import QUIZEZ from "../constants/quiz.constants.js";
const chapterData = async (filePath) => {
    try {
       await mongoose.connect("mongodb://127.0.0.1:27017/gita")
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    for (const row of sheetData) {
        const chapter = new Chapter({
            number: row["CHAPTER"],
            name: {
                english: row["ADHYAY NAME"]
            },
            totalVerses: row["NO. OF SHLOKAS"]
        })
             await chapter.save();
    }
   } catch (error) {
    console.log(error);
    
   }
}
// chapterData("C:\\Users\\h8551\\OneDrive\\Desktop\\operationData\\bhagavad-gita.xlsx");
const verseData = async (filePath) => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/gita")
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        for (const row of sheetData) {
            let verse = String(row["Verse"]);
            verse = verse.replace(".", "-");
            const audio = `https://gitadata.s3.us-east-1.amazonaws.com/Chant_Audio/${verse}.MP3`;
            let video = "";
            if (row["Chapter"] <= 3) {
                video = `https://gitadata.s3.us-east-1.amazonaws.com/Chapter+${row["Chapter"]}/${row["Verse"]}.mp4`;
            } else {
                video = `https://gitadata.s3.us-east-1.amazonaws.com/Chapter+${row["Chapter"]}/Bhagwad+Geeta+${row["Verse"]}.mp4`;
            }
            const verse1 = new Verse({
                verseNumber: row["Verse"],
                text: {
                    sanskrit: row["Sanskrit Anuvad"],
                    hindi: row["Hindi Anuvad"],
                    english: row["Engish Translation"]
                },
                speaker: row["Speaker"] || "Unknown",
                audioUrl: audio,
                videoUrl: video
            });
            
            await verse1.save();
            console.log("Verse saved:", verse1);
            let chapter = await Chapter.findOne({ number: row["Chapter"] });
            // Ensure verses is an array
            if (!Array.isArray(chapter.verses)) {
                chapter.verses = [];
            }
            chapter.verses.push(verse1._id);
            await chapter.save();
            console.log(`Verse ${verse1._id} added to Chapter ${row["Chapter"]}`);
                
        }
} catch (error) {
     console.log(error);
        
    }
}

const quizData = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/gita");
        
       const result =await Quiz.insertMany(QUIZEZ);
        console.log("Quiz data inserted successfully",result);
        mongoose.connection.close();
    } catch (error) {
        console.log(error);
        
    }
}
// quizData();
verseData("C:\\Users\\h8551\\OneDrive\\Desktop\\operationData\\updated_file2.xlsx")

