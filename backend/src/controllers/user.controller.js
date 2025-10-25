import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const isProduction = process.env.NODE_ENV === "production";

// Constants for cookie options
const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
};

// Helper function to generate tokens and set refresh token cookie
const generateAccessAndRefreshToken = async (userId) => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    await User.findByIdAndUpdate(userId, { refreshToken }, { new: true });

    return { accessToken, refreshToken };
};

//signup user
export const signup = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        throw new ApiError(400, "missing signup details!");
    }
    const user = await User.findOne({ email });
    if (user) {
        throw new ApiError(409, "user already exist!");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword
    });
    const userResponse = await User.findById(newUser._id).select("-password");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser._id);

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                201,
                { user: userResponse },
                "user registered successfully!"
            )
        )
})

//login user
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User doesn't exist")
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password invalid!");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const userResponse = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: userResponse },
                "User logged in successfully"
            )
        );
})

//logout user
export const logout = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
})

//refresh token
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "No refresh token provided");
    }

    let decoded;

    try {
        decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_SECRET);
    } catch (err) {
        throw new ApiError(403, "Invalid or expired refresh token");
    }
    const user = await User.findById(decoded.userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(403, "User not found");
    }
    const storedRefreshToken = await User.findById(decoded.userId).select("refreshToken");

    console.log("Stored refreshToken in DB:", storedRefreshToken.refreshToken);
    if (incomingRefreshToken !== storedRefreshToken.refreshToken) {
        await User.findByIdAndUpdate(
            user._id,
            {
                $set: { refreshToken: null }
            }
        );
        throw new ApiError(403, "Refresh token compromised or revoked. Please log in again.");
    }
    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user },
                "Token refreshed"
            )
        );

});

//check authentication
export const getUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

//update user profile
export const updateProfile = asyncHandler(async (req, res) => {
    const { fullName, bio } = req.body;
    const userId = req.user._id;

    let updatedUser;
    if (!req.file) {
        updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
    } else {
        const upload = await uploadOnCloudinary(req.file.path);
        updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: upload?.
                secure_url, bio, fullName
        }, { new: true }).select("-password -refreshToken");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { user: updatedUser }, "current user profile updated!!"))
})