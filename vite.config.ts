import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  handleChatRequest,
  type ChatRequestBody,
} from "./src/server/featherlessChat";
import { ChatRateLimitError } from "./src/server/chatRateLimit";
import { getClientKeyFromIncoming } from "./src/server/chatRateLimit";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function portfolioChatApiPlugin() {
  return {
    name: "portfolio-chat-api",
    configureServer(server: {
      middlewares: { use: (fn: unknown) => void };
    }) {
      server.middlewares.use(
        async (
          req: IncomingMessage,
          res: ServerResponse,
          next: () => void,
        ) => {
          const pathname = req.url?.split("?")[0] ?? "";
          if (pathname !== "/api/chat") {
            return next();
          }
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
          }
          try {
            const bodyText = await readBody(req);
            const body = JSON.parse(bodyText) as ChatRequestBody;
            const clientKey = getClientKeyFromIncoming(
              req.headers as NodeJS.Dict<string | string[] | undefined>,
              req.socket.remoteAddress,
            );
            const result = await handleChatRequest(body, { clientKey });
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
          } catch (e) {
            if (e instanceof ChatRateLimitError) {
              res.statusCode = 429;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error:
                    "Too many messages. Please wait a minute and try again.",
                }),
              );
              return;
            }
            const message = e instanceof Error ? e.message : "Chat failed";
            const isConfig = message.includes("FEATHERLESS_API_KEY");
            res.statusCode = isConfig ? 503 : 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: isConfig
                  ? "Set FEATHERLESS_API_KEY in .env for local chat."
                  : message,
              }),
            );
          }
        },
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return {
    test: {
      globals: true,
      environment: "jsdom",
      include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    },
    server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    portfolioChatApiPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.VITE_EMAIL_TEMPLATE_ID': JSON.stringify(env.VITE_EMAIL_TEMPLATE_ID),
    'process.env.VITE_EMAIL_PUBLIC_KEY': JSON.stringify(env.VITE_EMAIL_PUBLIC_KEY),
    'process.env.VITE_EMAIL_SERVICE_ID': JSON.stringify(env.VITE_EMAIL_SERVICE_ID),
}
}});