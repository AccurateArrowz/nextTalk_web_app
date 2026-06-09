import mongoose from "mongoose";
import { env } from "@config/env.js";

export async function connectDatabase() {
  if (!env.mongoUri) {
    console.warn("MongoDB URI not provided. Skipping database connection.");
    return;
  }

  try {
    if (env.mongoUri.includes("<username>") || env.mongoUri.includes("<password>")) {
      throw new Error("MONGO_URI still contains placeholder values.");
    }

    await mongoose.connect(env.mongoUri);
    console.log("✓ Database connected successfully");
  } catch (error) {
    console.error("✗ Failed to connect to database:", error);
    throw error;
  }
}
