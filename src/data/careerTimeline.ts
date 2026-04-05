/** Interactive timeline nodes: skills highlight what was exercised in each era. */
export interface CareerTimelineNode {
  id: string;
  period: string;
  organization: string;
  title: string;
  summary: string;
  highlights: string[];
  skills: string[];
  kind: "work" | "education";
}

export const careerTimelineNodes: CareerTimelineNode[] = [
  {
    id: "contentful",
    period: "2023 — Present",
    organization: "Contentful",
    title: "Software Engineer III",
    summary:
      "Marketplace, ecosystem infrastructure, and AWS-native observability—shipping product surfaces partners and customers rely on daily.",
    highlights: [
      "Marketplace listings, install flows, and auth-sensitive UX",
      "APIs and UI for third-party app discovery and onboarding",
      "AWS + Node + TypeScript services with production monitoring",
    ],
    skills: [
      "TypeScript",
      "React",
      "Node",
      "Postgres",
      "AWS",
      "API design",
    ],
    kind: "work",
  },
  {
    id: "primetrust",
    period: "2022 — Present",
    organization: "PrimeTrust",
    title: "Senior Software Engineer",
    summary:
      "Full-stack delivery across Ruby, TypeScript, Angular, and Nest—plus DevOps and infrastructure ownership in a regulated environment.",
    highlights: [
      "Automation that reduced operational toil across teams",
      "Scrum master / agile facilitation for the engineering team",
      "Heroku, AWS, Terraform, Datadog, Redis, Postgres in production",
    ],
    skills: [
      "Ruby",
      "TypeScript",
      "Angular",
      "Nest",
      "Postgres",
      "Terraform",
      "Datadog",
    ],
    kind: "work",
  },
  {
    id: "gopuff",
    period: "2021 — 2022",
    organization: "GoPuff",
    title: "Software Engineer → Tech lead",
    summary:
      "Lead engineer for enterprise integrations and Shopify fulfillment; OpenTelemetry + Datadog for business-grade insights.",
    highlights: [
      "PaaS / fulfillment platform direction with team leadership",
      "HIPAA pharmacy system (SignalR, .NET, Azure, Postgres)",
      "PagerDuty, Docker, Azure operations",
    ],
    skills: [
      "TypeScript",
      "React",
      "Node",
      "Redis",
      "Azure",
      "Docker",
      "OpenTelemetry",
    ],
    kind: "work",
  },
  {
    id: "broadcom",
    period: "2016 — 2021",
    organization: "Broadcom (Rally)",
    title: "Software Engineer",
    summary:
      "Enterprise SaaS for agile teams—React/Redux front end, Java services, and internal UI standards at CA scale.",
    highlights: [
      "MineralUI: reusable React library adopted as a UI standard",
      "Custom end-to-end testing frameworks across major upgrades",
      "Polyglot stack: React, Redux, Java, Postgres, Ruby",
    ],
    skills: [
      "React",
      "Redux",
      "Java",
      "Postgres",
      "Ruby",
      "Testing",
    ],
    kind: "work",
  },
  {
    id: "galvanize",
    period: "2015 — 2016",
    organization: "Galvanize",
    title: "Full Stack Web Development",
    summary:
      "Immersive bootcamp—language-agnostic fundamentals and shipping full-stack apps end to end.",
    highlights: ["MEAN/PEAN-style curriculum", "Intensive project work"],
    skills: ["JavaScript", "Node", "Web fundamentals"],
    kind: "education",
  },
];
