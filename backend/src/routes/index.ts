import { Router } from "express";
import { healthRouter } from "@routes/health.routes.js";
import { authRouter } from "@routes/auth.routes.js";
import { userRouter } from "@routes/user.routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
