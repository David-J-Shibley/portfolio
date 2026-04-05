import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  handleChatRequest,
  type ChatRequestBody,
} from "../src/server/featherlessChat";
import {
  ChatRateLimitError,
  getClientKeyFromIncoming,
} from "../src/server/chatRateLimit";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const raw = req.body;
    const body =
      typeof raw === "string"
        ? (JSON.parse(raw) as unknown)
        : raw;

    const clientKey = getClientKeyFromIncoming(
      req.headers as NodeJS.Dict<string | string[] | undefined>,
      undefined,
    );
    const result = await handleChatRequest(body as ChatRequestBody, {
      clientKey,
    });
    return res.status(200).json(result);
  } catch (e) {
    if (e instanceof ChatRateLimitError) {
      return res.status(429).json({
        error: "Too many messages. Please wait a minute and try again.",
      });
    }
    const message = e instanceof Error ? e.message : "Chat failed";
    const isConfig = message.includes("FEATHERLESS_API_KEY");
    return res.status(isConfig ? 503 : 500).json({
      error: isConfig ? "Chat is not configured on this deployment." : message,
    });
  }
}
