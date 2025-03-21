import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.user._id;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true})
    if (!user) {
        throw new ApiError(404, "user not found");
    }
    res.status(200).json(new ApiResponse(200, { user }, "user updated successfully"));
    
})

const getUser = asyncHandler(async (req, res) => { 

    
    const id = req.user._id;
    if (!id)
    {
        throw new ApiError(400, "user not valid");
    }
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "user not found");
    }
    res.status(200).json(new ApiResponse(200, { user }, "user fetched successfully"));
})
export { updateUser ,getUser};