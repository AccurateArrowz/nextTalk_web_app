import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "@config/env.js";
import { connectDatabase } from "@config/database.js";
import { initSocketServer } from "./socket.js";

await connectDatabase();

const app = createApp();
const httpServer = createServer(app);

initSocketServer(httpServer);

httpServer.listen(env.port, "0.0.0.0", () => {
  // Keep startup logging simple and explicit.
  console.log(`Server listening on http://0.0.0.0:${env.port}`);
  console.log(`CORS allowed origins:`, env.clientOrigins);
});
