import { Router } from "express";
import { getHealth } from "@features/health/health.controller.js";

export const healthRouter = Router();

healthRouter.get("/", getHealth);
