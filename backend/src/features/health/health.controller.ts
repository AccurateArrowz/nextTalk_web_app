import type { Request, Response } from "express";
import { healthService } from "@features/health/health.service.js";

export function getHealth(_req: Request, res: Response) {
  const payload = healthService.getStatus();

  res.status(200).json(payload);
}
