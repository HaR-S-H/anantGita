import express from "express";
import dotenv from "dotenv";
import connectedDB from "./db/connection.js";
import authRoute from "./routes/auth.routes.js"
import chapterRoute from "./routes/chapter.routes.js"
import progressRoute from "./routes/progress.routes.js";
import noteRoute from "./routes/note.routes.js";
import verseRoute from "./routes/verse.routes.js";
import scoreRoute from "./routes/score.routes.js";
import userRoute from "./routes/user.routes.js";
import ragRoute from "./routes/rag.routes.js";
import quizRoute from "./routes/quiz.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import quizHistoryRoute from "./routes/quizHistory.routes.js"
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    }
));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/chapters", chapterRoute);
app.use("/api/v1/verses", verseRoute);
app.use("/api/v1/progress", progressRoute);
app.use("/api/v1/notes", noteRoute);
app.use("/api/v1/scores", scoreRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/rag", ragRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/quizHistory", quizHistoryRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
    connectedDB();
})