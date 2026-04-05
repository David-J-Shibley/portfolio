import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChatMarkdown } from "@/components/ChatMarkdown";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTION_CHIPS = [
  "What are you working on at Contentful right now?",
  "Summarize your GoPuff platform and fulfillment work.",
  "How did you approach the Contentful Marketplace?",
  "What stack do you use for the browser games here?",
];

const PortfolioChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const sendMessage = useCallback(
    async (trimmed: string) => {
      if (!trimmed || loading) return;

      setError(null);
      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages }),
        });
        const data = (await res.json()) as { message?: string; error?: string };
        if (res.status === 429) {
          throw new Error(
            data.error ??
              "Too many messages right now. Please wait a bit and try again.",
          );
        }
        if (!res.ok) {
          throw new Error(data.error ?? "Something went wrong");
        }
        if (!data.message) {
          throw new Error("Empty response");
        }
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message! },
        ]);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Request failed";
        setError(msg);
        setMessages((prev) => prev.slice(0, -1));
        setInput(trimmed);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages],
  );

  const send = useCallback(() => {
    void sendMessage(input.trim());
  }, [input, sendMessage]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg md:bottom-8 md:right-8"
          aria-label="Chat with David's portfolio assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="!flex max-h-[85vh] w-[calc(100vw-1.5rem)] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="shrink-0 border-b px-6 py-4 pr-12 text-left">
          <DialogTitle>Chat with David</DialogTitle>
          <DialogDescription className="text-left">
            An AI assistant grounded in this portfolio — not a live DM.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 border-b px-4 py-3">
          {SUGGESTION_CHIPS.map((label) => (
            <button
              key={label}
              type="button"
              disabled={loading}
              onClick={() => void sendMessage(label)}
              className={cn(
                "rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors",
                "hover:bg-secondary disabled:opacity-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-3 [-webkit-overflow-scrolling:touch]"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          <div className="flex flex-col gap-3">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Ask about my experience at Contentful, GoPuff, projects on this
                site, or how to reach me.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={cn(
                  "max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground whitespace-pre-wrap"
                    : "mr-auto border bg-muted/50",
                )}
              >
                {m.role === "assistant" ? (
                  <ChatMarkdown>{m.content}</ChatMarkdown>
                ) : (
                  m.content
                )}
              </div>
            ))}
            {loading && (
              <div className="mr-auto flex items-center gap-2 rounded-2xl border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking…
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {error && (
          <p className="shrink-0 border-t border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-xs text-destructive">
            {error}
          </p>
        )}

        <div className="flex shrink-0 gap-2 border-t p-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Message…"
            rows={2}
            disabled={loading}
            className={cn(
              "min-h-[2.75rem] flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
          <Button
            type="button"
            size="icon"
            className="h-10 w-10 shrink-0 self-end"
            disabled={loading || !input.trim()}
            onClick={send}
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioChat;
