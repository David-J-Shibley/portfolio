import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { ChatMarkdown } from "@/components/ChatMarkdown";
import {
  caseStudyMarkdown,
  caseStudySlugs,
  getCaseStudy,
  type CaseStudySlug,
} from "@/data/caseStudies";

function isSlug(s: string): s is CaseStudySlug {
  return (caseStudySlugs as readonly string[]).includes(s);
}

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug || !isSlug(slug)) {
    return <Navigate to="/case-studies" replace />;
  }

  const meta = getCaseStudy(slug);
  const body = caseStudyMarkdown[slug];
  if (!meta) return <Navigate to="/case-studies" replace />;

  return (
    <>
      <PageMeta
        title={meta.title}
        description={meta.excerpt}
        path={`/case-studies/${slug}`}
        image={meta.image}
      />
      <article className="bg-background pt-28 pb-20 md:pt-32">
        <div className="container px-6 mx-auto max-w-3xl">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            All case studies
          </Link>

          <header className="mb-10">
            <p className="caption text-muted-foreground mb-2">{meta.subtitle}</p>
            <h1 className="heading-lg mb-4">{meta.title}</h1>
            <p className="body-lg text-muted-foreground">{meta.excerpt}</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {meta.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </header>

          <div className="rounded-2xl border bg-muted/20 p-6 md:p-10">
            <ChatMarkdown>{body}</ChatMarkdown>
          </div>
        </div>
      </article>
    </>
  );
}
