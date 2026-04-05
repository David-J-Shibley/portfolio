import { Sparkles } from "lucide-react";

const items = [
  {
    label: "Now",
    text: "Shipping work on Contentful’s **Translations** product.",
  },
  {
    label: "Also",
    text:
      "Building AI-integrated tools — including [Grocery Goblin](https://www.grocerygoblin.com).",
  },
];

export function NowStrip() {
  return (
    <div className="mb-8 rounded-xl border bg-secondary/40 px-4 py-3 text-sm md:px-5 md:py-4">
      <div className="flex items-start gap-3">
        <Sparkles
          className="mt-0.5 h-5 w-5 shrink-0 text-primary"
          aria-hidden
        />
        <ul className="space-y-2 text-muted-foreground">
          {items.map((item) => (
            <li key={item.label}>
              <span className="font-semibold text-foreground">{item.label}:</span>{" "}
              <NowLine text={item.text} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NowLine({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) {
          return (
            <strong key={i} className="text-foreground font-semibold">
              {bold[1]}
            </strong>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          return (
            <a
              key={i}
              href={link[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline font-medium"
            >
              {link[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
