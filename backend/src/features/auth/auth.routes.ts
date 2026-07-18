import { Router } from "express";
import { login, register, logout, refresh } from "@features/auth/auth.controller.js";
import { validateBody } from "@middleware/validate-request.js";
import { loginUserSchema, registerUserSchema } from "@nexttalk/shared";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
