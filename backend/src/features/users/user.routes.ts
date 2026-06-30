import { Router } from "express";
import { requireAuth } from "@middleware/require-auth.js";
import { getMe, patchMe, profileImageUpload, updatePassword } from "@features/users/user.controller.js";

export const userRouter = Router();

userRouter.get("/me", requireAuth, getMe);
userRouter.patch("/me", requireAuth, profileImageUpload, patchMe);
userRouter.patch("/me/password", requireAuth, updatePassword);
