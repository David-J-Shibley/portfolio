import { buildChatSystemPrompt } from "../data/portfolioContext";
import { consumeChatRateToken } from "./chatRateLimit";

const FEATHERLESS_URL = "https://api.featherless.ai/v1/chat/completions";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export interface ChatRequestBody {
  messages: ChatMessage[];
}

export interface ChatResponseBody {
  message: string;
}

function getModel(): string {
  return process.env.FEATHERLESS_MODEL ?? "Qwen/Qwen2.5-7B-Instruct";
}

export async function handleChatRequest(
  body: ChatRequestBody,
  options?: { clientKey?: string },
): Promise<ChatResponseBody> {
  if (options?.clientKey) {
    consumeChatRateToken(options.clientKey);
  }

  const apiKey = process.env.FEATHERLESS_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error("FEATHERLESS_API_KEY is not configured");
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    throw new Error("messages must be a non-empty array");
  }

  for (const m of body.messages) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string"
    ) {
      throw new Error("invalid message shape");
    }
  }

  const system = buildChatSystemPrompt();
  const messages = [
    { role: "system" as const, content: system },
    ...body.messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetch(FEATHERLESS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getModel(),
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Featherless error ${res.status}: ${errText.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("empty model response");
  }

  return { message: content };
}
