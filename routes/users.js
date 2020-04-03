import express from "express";
import { signup, signin } from "../controllers/userController";
import { signupValidate } from "../Middleware/userValidation";

const userRouter = express.Router();

userRouter.route("/api/v1/auth/signup").post(signupValidate, signup);
userRouter.route("/api/v1/auth/signin").post(signupValidate, signin);

export default userRouter;
