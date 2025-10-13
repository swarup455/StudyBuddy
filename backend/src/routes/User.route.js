import express from "express"
import { getUser, login, logout, refreshAccessToken, signup, updateProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", verifyJWT, upload.single("profilePic"), updateProfile);
userRouter.get("/get-user", verifyJWT, getUser);
userRouter.post("/refresh-access-token", refreshAccessToken);
userRouter.get("/logout", logout)

export default userRouter