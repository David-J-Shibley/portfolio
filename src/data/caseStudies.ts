export const caseStudySlugs = ["gopuff-paas", "contentful-marketplace"] as const;
export type CaseStudySlug = (typeof caseStudySlugs)[number];

export interface CaseStudySummary {
  slug: CaseStudySlug;
  title: string;
  subtitle: string;
  excerpt: string;
  image: string;
  tags: string[];
}

export const caseStudies: CaseStudySummary[] = [
  {
    slug: "gopuff-paas",
    title: "GoPuff: enterprise PaaS & Shopify fulfillment",
    subtitle: "Platform engineering at scale",
    excerpt:
      "Turning a single-brand storefront into a fulfillment and integrations platform that partners could adopt—with observability, compliance, and revenue impact.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    tags: ["TypeScript", "React", "Node", "Azure", "Redis", "Datadog"],
  },
  {
    slug: "contentful-marketplace",
    title: "Contentful Marketplace",
    subtitle: "Third-party apps, listings, and install flows",
    excerpt:
      "End-to-end work on a marketplace where customers discover apps, understand capabilities, and complete installation with trustworthy auth and operational clarity.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    tags: ["TypeScript", "React", "Node", "Postgres", "AWS"],
  },
];

export const caseStudyMarkdown: Record<CaseStudySlug, string> = {
  "gopuff-paas": `
## Context

GoPuff needed to move beyond a single consumer storefront: partners and brands wanted to plug into fulfillment and commerce capabilities without rebuilding the stack each time. The goal was a **platform-as-a-service** posture—repeatable APIs, operational visibility, and a path to onboard external businesses safely.

## What I owned

- **Technical leadership** for enterprise integrations and the **Shopify fulfillment** initiative, working closely with product and stakeholders while supporting a small engineering team.
- **Full-stack delivery** across TypeScript, React, Node, Redis, Azure, and Docker—balancing speed with reliability for money-moving flows.
- **Observability** via a **custom OpenTelemetry** integration with **Datadog**, oriented toward business insights (not only red/green dashboards) and feeding downstream needs such as ads-related analytics.

## Architecture & delivery themes

- **Service boundaries** that could evolve as the platform grew—clear contracts for integrations and fulfillment workflows.
- **Redis and real-time patterns** where latency and coordination mattered for operational tooling and customer-facing experiences.
- **Azure-first deployment** with containerized services and pragmatic DevOps practices (including **PagerDuty** for incident response).

## HIPAA pharmacy initiative (parallel track)

I also led engineering on a **HIPAA-aligned pharmacy management system** (TypeScript, React, Redis, SignalR, C#/.NET, Postgres, Azure). A major outcome was pushing toward **high automation** in pharmacy operations—reducing manual toil while staying inside strict compliance constraints.

## Outcomes (as stated publicly on the portfolio)

The PaaS / fulfillment direction was tied to **significant revenue impact in its first year** (on the order of **nine figures**). The deeper win was establishing a **repeatable platform pattern**: integrations, monitoring, and operational playbooks that teams could extend without heroics.

## What I’d emphasize in an interview

- Turning ambiguous “we should be a platform” intent into **shippable slices** with measurable adoption.
- Making observability **legible to the business**, not only engineering.
- Leading through **technical depth** and **execution hygiene** (incidents, ownership, and cross-team alignment).
`.trim(),

  "contentful-marketplace": `
## Context

Contentful’s **Marketplace** is where customers find third-party apps that extend the product: integrations, workflows, and ecosystem value. The surface area spans **discovery** (listings), **trust** (what an app can do), and **installation** (auth and safe onboarding into customer organizations).

## What I worked on

- **Marketplace product engineering**: building and maintaining customer-facing experiences that make it easy to understand, compare, and install apps.
- **APIs and UI** supporting **app listings**, **installation flows**, and **authentication mechanisms**—the parts that must feel boringly reliable because they touch customer data and org boundaries.
- **Developer experience** improvements for teams integrating external services with Contentful—reducing friction in the “happy path” and making failure modes understandable.

## Platform & reliability

- **Core ecosystem infrastructure** on **AWS** with **Node** and **TypeScript**, emphasizing maintainability across many app partners and internal teams.
- **Observability and monitoring** for production services using **AWS-native tooling**, so regressions are caught early and incidents are actionable.

## What “good” looked like

- A marketplace that feels **cohesive with the core product**—not a separate mini-site with different rules.
- Installation flows that are **explicit, reversible where possible**, and **safe-by-default** for admins making org-wide decisions.
- Internal velocity: engineers can extend listing and install surfaces without re-learning a bespoke stack each time.

## Interview narrative

I’d focus on **ecosystem thinking**: third-party apps introduce versioning, trust, and long-tail edge cases. The engineering challenge is building **opinionated frameworks** (for listings, permissions, and install) that still leave room for partners to innovate—without turning the Marketplace into endless one-offs.
`.trim(),
};

export function getCaseStudy(slug: string): CaseStudySummary | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
