import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { apiRouter } from "@routes/index.js";
import { notFoundHandler } from "@middleware/notFoundHandler.js";
import { errorHandler } from "@middleware/errorHandler.js";
import { env } from "@config/env.js";

export function createApp() {
  const app = express();
  const corsOptions = {
    origin: env.clientOrigins,
    credentials: true
  };

  app.use(helmet());
  // app.use(cors(corsOptions));
  // Express 5 no longer accepts the bare "*" route pattern here.
app.options(/.*/, cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime()
    });
  });

  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
