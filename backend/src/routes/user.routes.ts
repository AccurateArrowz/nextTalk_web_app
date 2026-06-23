import { Router } from "express";
import { getMe, patchMe, profileImageUpload, updatePassword } from "@controllers/user.controller.js";
import { requireAuth } from "@middleware/require-auth.js";

export const userRouter = Router();

userRouter.get("/me", requireAuth, getMe);
userRouter.patch("/me", requireAuth, profileImageUpload, patchMe);
userRouter.patch("/me/password", requireAuth, updatePassword);
