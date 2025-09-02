import express from "express"
import { authCheck, login, signup, updateProfile } from "../controllers/userController.js";
import { protectedRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup",signup)
userRouter.post("/login",login)
userRouter.get("/auth-check",protectedRoute,authCheck)
userRouter.put("/update-profile",protectedRoute,updateProfile)

export default userRouter;