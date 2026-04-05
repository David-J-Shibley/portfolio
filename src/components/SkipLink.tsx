import { cn } from "@/lib/utils";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200]",
        "focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground",
        "focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
      )}
    >
      Skip to main content
    </a>
  );
}
