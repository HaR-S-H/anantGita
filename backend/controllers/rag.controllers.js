import Rag from "../models/rag.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import axios from "axios";
const getRag = asyncHandler(async (req, res) => { 
    const  id  = req.user._id;
    const rag = await Rag.findOne({ userId: id });
    if (!rag) {
        throw new ApiError(404, "History not found");
    }
    res.status(200).json(new ApiResponse(200, { rag }, "History fetched successfully"));
});

const createRag = asyncHandler(async (req, res) => {
    const  id  = req.user._id;
    const { query } = req.body;
    if (!query) {
        throw new ApiError(400, "Query text is required");
    }
    const response = await axios.post(`${process.env.FASTAPI_URL}/query`, { query });
console.log(response.data.response);

    let rag = await Rag.findOne({ userId: id });
    if (!rag) {
        rag = new Rag({
            userId: id,
            queries: [
                {
                    queryText: query,
                    responseText: response.data.response, // Fix: Extract correct field
                },
            ],
        });
    } else {
        rag.queries.push({
            queryText: query,
            responseText: response.data.response,
        });
    }

    await rag.save();
    console.log(rag);
    
    res.status(201).json(new ApiResponse(201, { rag }, "History created successfully"));
});
 
export { getRag, createRag };