import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { notFoundHandler } from "@middleware/notFoundHandler.js";
import { errorHandler } from "@middleware/errorHandler.js";
import { env } from "@config/env.js";
import { apiRouter } from "@routes/index.js";

export function createApp() {
  const app = express();
  const corsOptions: cors.CorsOptions = {
    origin: env.clientOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
  };

  // Express 5 requires named wildcards in path-to-regexp v8 — "/{*path}" matches all routes
  app.options("/{*path}", cors(corsOptions)); // handle preflight explicitly
  app.use(cors(corsOptions));                 // apply CORS headers to all responses
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }, // allow cross-origin fetches
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime()
    });
  });

  app.use("/api/v1", apiRouter);
  // app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
