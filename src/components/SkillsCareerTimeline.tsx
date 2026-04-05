import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  careerTimelineNodes,
  type CareerTimelineNode,
} from "@/data/careerTimeline";

function NodeIcon({ node }: { node: CareerTimelineNode }) {
  if (node.kind === "education") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
        <GraduationCap size={18} />
      </div>
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200">
      <Briefcase size={18} />
    </div>
  );
}

export function SkillsCareerTimeline() {
  const [openId, setOpenId] = useState<string | null>(
    careerTimelineNodes[0]?.id ?? null,
  );
  const reduceMotion = useReducedMotion();

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mx-auto max-w-3xl">
      <p className="body-md text-muted-foreground mb-10 text-center max-w-xl mx-auto">
        Click a stop on the timeline to see what I was building and which
        skills were in heavy rotation.
      </p>
      <ol className="relative space-y-0 border-l border-border pl-8 md:pl-10 ml-4 md:ml-6">
        {careerTimelineNodes.map((node) => {
          const open = openId === node.id;
          return (
            <li key={node.id} className="relative pb-10 last:pb-2">
              <span
                className="absolute -left-[9px] md:-left-[11px] top-3 h-4 w-4 rounded-full border-2 border-background bg-primary"
                aria-hidden
              />
              <div
                className={cn(
                  "rounded-xl border bg-card text-left transition-shadow",
                  open ? "shadow-md ring-1 ring-primary/20" : "shadow-sm",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(node.id)}
                  className={cn(
                    "flex w-full items-start gap-4 p-5 text-left rounded-xl",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  )}
                  aria-expanded={open}
                >
                  <NodeIcon node={node} />
                  <div className="min-w-0 flex-1">
                    <span className="caption text-muted-foreground">
                      {node.period}
                    </span>
                    <h3 className="heading-sm mt-1">{node.organization}</h3>
                    <p className="text-sm font-medium text-primary/90">
                      {node.title}
                    </p>
                    <p className="body-sm text-muted-foreground mt-2">
                      {node.summary}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                      open && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.28,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="overflow-hidden border-t"
                    >
                      <div className="space-y-4 px-5 pb-5 pt-4 md:pl-[5.25rem]">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                            Highlights
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {node.highlights.map((h) => (
                              <li key={h}>{h}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                            Skills map
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {node.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
