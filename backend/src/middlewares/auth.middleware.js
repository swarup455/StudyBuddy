import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // THIS IS THE CRITICAL PART - Handle token expiration properly
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_SECRET);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                // Return 401 so frontend interceptor can handle refresh
                throw new ApiError(401, "Access token expired");
            }
            if (jwtError.name === 'JsonWebTokenError') {
                throw new ApiError(401, "Invalid access token");
            }
            throw new ApiError(401, "Token verification failed");
        }
        
        const user = await User.findById(decodedToken?.userId).select("-password -refreshToken");
        
        if (!user) {
            throw new ApiError(401, "Invalid access token - user not found");
        }

        req.user = user;
        next();
    } catch (error) {
        // Make sure error gets properly sent as HTTP response
        throw error;
    }
});