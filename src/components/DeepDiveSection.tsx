import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { deepDiveProject } from "@/data/deepDive";
import { Button } from "@/components/ui/button";

export function DeepDiveSection() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-start">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -12 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: reduceMotion ? 0 : 0.45 }}
      >
        <h3 className="heading-md mb-3">{deepDiveProject.title}</h3>
        <p className="body-md text-muted-foreground mb-6">
          {deepDiveProject.tagline}
        </p>
        <Button asChild>
          <Link
            to={deepDiveProject.path}
            className="inline-flex items-center gap-2"
          >
            Play the demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
      <motion.div
        className="space-y-6 rounded-2xl border bg-muted/30 p-6 md:p-8"
        initial={reduceMotion ? false : { opacity: 0, x: 12 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.08 }}
      >
        {deepDiveProject.sections.map((s) => (
          <div key={s.heading}>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
              {s.heading}
            </h4>
            <p className="body-sm text-muted-foreground leading-relaxed">
              {s.body}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
