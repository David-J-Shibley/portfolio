import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import {
  handleChatRequest,
  type ChatRequestBody,
} from "../src/server/featherlessChat";
import {
  ChatRateLimitError,
  getClientKeyFromIncoming,
} from "../src/server/chatRateLimit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = Number(process.env.PORT) || 8080;

app.disable("x-powered-by");
app.use(express.json({ limit: "256kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post("/api/chat", async (req, res) => {
  try {
    const clientKey = getClientKeyFromIncoming(
      req.headers as NodeJS.Dict<string | string[] | undefined>,
      req.socket.remoteAddress,
    );
    const result = await handleChatRequest(req.body as ChatRequestBody, {
      clientKey,
    });
    res.json(result);
  } catch (e) {
    if (e instanceof ChatRateLimitError) {
      return res.status(429).json({
        error: "Too many messages. Please wait a minute and try again.",
      });
    }
    const message = e instanceof Error ? e.message : "Chat failed";
    const isConfig = message.includes("FEATHERLESS_API_KEY");
    res.status(isConfig ? 503 : 500).json({
      error: isConfig ? "Chat is not configured." : message,
    });
  }
});

const distDir = path.join(__dirname, "dist");
app.use(express.static(distDir, { index: false }));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on http://0.0.0.0:${port}`);
});
