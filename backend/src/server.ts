import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "@config/env.js";
import { connectDatabase } from "@config/database.js";
import { initSocketServer } from "./socket.js";

await connectDatabase();

const app = createApp();
const httpServer = createServer(app);

initSocketServer(httpServer);

httpServer.listen(env.port, () => {
  // Keep startup logging simple and explicit.
  console.log(`Server listening on http://localhost:${env.port}`);
  console.log(`CORS allowed origins:`, env.clientOrigins);
});
