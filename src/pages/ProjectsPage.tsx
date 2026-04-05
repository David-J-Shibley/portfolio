import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";
import Section, { SectionHeader } from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import {
  projects,
  projectKindLabels,
  type ProjectKind,
} from "@/data/projects";
import { cn } from "@/lib/utils";

const filters: { id: "all" | ProjectKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "professional", label: projectKindLabels.professional },
  { id: "web", label: projectKindLabels.web },
  { id: "game", label: projectKindLabels.game },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => p.kind === filter);
  }, [filter]);

  return (
    <>
      <PageMeta
        title="Projects"
        description="Games, web apps, and professional work — filter by type."
        path="/projects"
      />
      <div className="bg-background pt-28 pb-20 md:pt-32">
        <Section id="projects-list">
          <SectionHeader
            eyebrow="Portfolio"
            title="All projects"
            description="Filter by games, web apps, or professional work. Many games also appear on the Games hub."
          />

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  filter === f.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-14">
            Looking for more browser games?{" "}
            <Link
              to="/games"
              className="text-primary font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Browse the games hub
            </Link>
            .
          </p>
        </Section>
      </div>
    </>
  );
}
