import Rag from "../models/rag.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY, // 🔑 important
});
const getRag = asyncHandler(async (req, res) => { 
    console.log("he");
    const  id  = req.user._id;
    const rag = await Rag.findOne({ userId: id });
    if (!rag) {
        throw new ApiError(404, "History not found");
    }
    res.status(200).json(new ApiResponse(200, { rag }, "History fetched successfully"));
});

const createRag = asyncHandler(async (req, res) => {
     console.log("Incoming query request");

    const id = req.user._id;
    const { query } = req.body;

    if (!query) {
        throw new ApiError(400, "Query text is required");
    }

    let aiReply = "";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview", // working preview model
            contents: query,
        });

        aiReply = response.text || "No response from Gemini";
        console.log("Gemini Response:", aiReply);

    } catch (error) {
        console.error("Gemini SDK Error:", error);

        throw new ApiError(
            500,
            error.message || "Failed to get response from Gemini"
        );
    }

    // 🔹 Save query + response in DB
    let rag = await Rag.findOne({ userId: id });

    const newEntry = {
        queryText: query,
        responseText: aiReply,
    };

    if (!rag) {
        rag = new Rag({
            userId: id,
            queries: [newEntry],
        });
    } else {
        rag.queries.push(newEntry);
    }

    await rag.save();

    res
        .status(201)
        .json(new ApiResponse(201, { rag }, "Query & response saved successfully"));
});
 
export { getRag, createRag };