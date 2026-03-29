import express from "express";
import { createUser, getAllUsers, getUser, loginUser, updateUserRole } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/",createUser)
userRouter.post("/login",loginUser)
userRouter.get("/me",getUser)
userRouter.get("/all",getAllUsers)
userRouter.get("/role",updateUserRole)

export default userRouter;