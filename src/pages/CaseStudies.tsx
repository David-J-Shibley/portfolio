import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import Section, { SectionHeader } from "@/components/Section";
import { caseStudies } from "@/data/caseStudies";

export default function CaseStudies() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <PageMeta
        title="Case studies"
        description="Long-form write-ups on platform engineering at GoPuff and the Contentful Marketplace."
        path="/case-studies"
      />
      <div className="bg-background pt-28 pb-20 md:pt-32">
        <Section id="case-studies">
          <SectionHeader
            eyebrow="Depth"
            title="Case studies"
            description="How I think about platform surfaces, ecosystem products, and shipping under real constraints — with enough detail for a serious technical conversation."
          />

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {caseStudies.map((cs, index) => (
              <motion.article
                key={cs.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  delay: reduceMotion ? 0 : index * 0.08,
                }}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={cs.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <p className="caption text-muted-foreground mb-2">
                    {cs.subtitle}
                  </p>
                  <h2 className="heading-sm mb-3">{cs.title}</h2>
                  <p className="body-sm text-muted-foreground flex-1 mb-6">
                    {cs.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {cs.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/case-studies/${cs.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    Read case study
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
