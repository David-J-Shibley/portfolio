import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

type ChatMarkdownProps = {
  children: string;
  className?: string;
};

/**
 * Renders model output as Markdown (bold, lists, links) without raw HTML.
 */
export function ChatMarkdown({ children, className }: ChatMarkdownProps) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none text-foreground dark:prose-invert",
        "prose-p:leading-relaxed prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0",
        "prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5",
        "prose-strong:font-semibold prose-strong:text-foreground",
        "prose-headings:mb-2 prose-headings:mt-3 prose-headings:text-foreground first:prose-headings:mt-0",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        className,
      )}
    >
      <ReactMarkdown
        components={{
          a: ({ href, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
