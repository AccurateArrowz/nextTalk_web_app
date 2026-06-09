import { createApp } from "./app.js";
import { env } from "@config/env.js";

const app = createApp();

app.listen(env.port, () => {
  // Keep startup logging simple and explicit.
  console.log(`Server listening on http://localhost:${env.port}`);
});
