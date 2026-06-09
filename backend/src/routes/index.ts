import { Router } from "express";
import { healthRouter } from "@routes/health.routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
