import { caseStudies } from "./caseStudies";
import { projects } from "./projects";

export type TimelineKind = "education" | "experience";

export interface TimelineEntry {
  date: string;
  title: string;
  organization: string;
  description: string[];
  type: TimelineKind;
}

export const heroBio =
  "I create elegant, robust web applications with a focus on user experience. As a seasoned developer with experience at Contentful, PrimeTrust, GoPuff, and Broadcom, I bring creative solutions to complex problems.";

export const contactForChat = {
  name: "David Shibley",
  role: "Full Stack Developer",
  linkedin: "https://linkedin.com/in/davidshibley",
  github: "https://github.com/David-Shibley",
  email: "davidjshibley@gmail.com",
};

export const skillsSummary = `
Frontend: JavaScript/ES7, TypeScript, React, Angular, HTML/CSS/SCSS, Jest/Enzyme
Backend: Node.js, Ruby, C#/.NET, Python, PostgreSQL, Redis
DevOps & tools: AWS, Azure, Docker, Datadog, Jenkins, Git/GitHub
`;

export const gamesNote =
  "This portfolio includes many browser games (chess, checkers, monopoly, snake, invaders, and more) under the /games route and individual paths like /chess, /checkers, /monopoly, etc.";

export const experiences: TimelineEntry[] = [
  {
    date: "October 2023 - Present",
    title: "Software Engineer III",
    organization: "Contentful",
    description: [
      "Developed and maintained Contentful's Marketplace, enabling seamless third-party app integrations using TypeScript, React, Node, and Postgres.",
      "Designed and implemented APIs and UI components to support app listings, installation workflows, and authentication mechanisms.",
      "Improved developer experience by streamlining the process of integrating external services with Contentful.",
      "Built and maintained core infrastructure supporting Contentful's ecosystem using AWS, Node, TypeScript.",
      "Enhanced observability and monitoring for production services using AWS-native tools.",
    ],
    type: "experience",
  },
  {
    date: "December 2022 - Present",
    title: "Senior Software Engineer",
    organization: "PrimeTrust",
    description: [
      "Rapidly acquired expertise in Ruby within the first week to work with legacy API.",
      "Automated tasks for various roles reducing employee pain points using Ruby, TypeScript, Angular, Nest, Node, Postgres.",
      "Provided full-stack development expertise and lead the team's agile processes as scrum master.",
      "Assisted with critical DevOps tasks using Ruby, AWS, Heroku, Postgres, Redis, Datadog, and Looker.",
      "Managed production resources and contributed to Terraform infrastructure.",
    ],
    type: "experience",
  },
  {
    date: "January 2021 - December 2022",
    title: "Software Engineer",
    organization: "GoPuff",
    description: [
      "Lead engineer for Enterprise Integrations & Shopify Fulfillment App, generating close to $150 million the first year using TypeScript, React, Node, Redis, Azure, Docker.",
      "Served as tech lead and assistant dev manager over a team of five people.",
      "Implemented custom OpenTelemetry with Datadog to provide business insights and power the Ad platform.",
      "Built a HIPAA compliant Pharmacy Management System as lead engineer using TypeScript, React, Redis, SignalR, C#/.NET, Postgres, Azure.",
      "Built the world's first fully automated pharmacy which allowed multiple pharmacies to be operated by a single pharmacist.",
    ],
    type: "experience",
  },
  {
    date: "April 2016 - January 2021",
    title: "Software Engineer",
    organization: "Broadcom",
    description: [
      "Supported Rally - a collaborative, enterprise SaaS platform for agile development using JavaScript, React, Redux, Java, Postgres, Ruby, Bash, RedHat.",
      "Lead multiple code upgrades and built two custom end-to-end testing frameworks.",
      "Created MineralUI - a reusable React component library that became CA's UI standard after acquisition.",
    ],
    type: "experience",
  },
];

export const education: TimelineEntry[] = [
  {
    date: "August 2015 - April 2016",
    title: "Full Stack Web Development",
    organization: "Galvanize, Denver",
    description: [
      "Web-dev bootcamp. MEAN/PEAN stack with a language agnostic approach.",
    ],
    type: "education",
  },
];

export const resumeSidebarProjects: {
  title: string;
  summary: string;
  tech: string;
}[] = [
  {
    title: "Daily Site Runner",
    summary: "Conveniently opens sites you use everyday",
    tech: "ES7, HTML5, CRA, React functional components, Material-UI, SCSS",
  },
  {
    title: "Checkers",
    summary: "A game of checkers",
    tech: "Vite, TypeScript, Motion, Tailwind",
  },
  {
    title: "Royal Oaks Services",
    summary: "Volunteered to build a website for a non-profit",
    tech: "ES7, HTML5, CRA, React functional components, Material-UI, SCSS",
  },
];

function formatTimeline(entries: TimelineEntry[], heading: string): string {
  const blocks = entries.map(
    (e) =>
      `${e.date} — ${e.title} at ${e.organization}\n` +
      e.description.map((d) => `  - ${d}`).join("\n"),
  );
  return `${heading}\n${blocks.join("\n\n")}`;
}

function formatProjectsForPrompt(): string {
  return projects
    .map((p) => {
      const lines = [
        `${p.title} (${p.date})`,
        p.description,
        p.longDescription,
        p.team ? `Team: ${p.team}` : null,
        p.tags.length ? `Tags: ${p.tags.join(", ")}` : null,
        p.demo ? `Demo: ${p.demo}` : null,
        p.features.length ? `Highlights:\n${p.features.map((f) => `  - ${f}`).join("\n")}` : null,
      ].filter(Boolean);
      return lines.join("\n");
    })
    .join("\n\n---\n\n");
}

export function buildChatSystemPrompt(): string {
  const resumeProjects = resumeSidebarProjects
    .map((p) => `${p.title}: ${p.summary}. Tech: ${p.tech}`)
    .join("\n");

  return [
    `You are ${contactForChat.name}, a ${contactForChat.role}. You are speaking in first person with visitors to your portfolio site.`,
    "Stay in character as David. Be warm, professional, and concise unless the visitor asks for detail.",
    "Ground your answers ONLY in the context below. If something is not covered here, say you would rather follow up by email or LinkedIn and give the contact info.",
    "You are an AI assistant representing David — if asked directly, acknowledge that you are an AI trained on his public portfolio content, not a live chat.",
    "Format answers with Markdown the site can render: put a blank line before bullet lists, one list item per line starting with '- ', use **bold** for short labels, and use short paragraphs.",
    "",
    "## Currently",
    "- At Contentful: working on the Translations product.",
    "- Side projects: building AI-integrated tools, including Grocery Goblin (https://www.grocerygoblin.com).",
    "",
    "## Case studies on this site",
    ...caseStudies.map(
      (c) =>
        `- **${c.title}** (${c.slug}): ${c.excerpt}`,
    ),
    "",
    "## About me",
    heroBio,
    "",
    "## Contact",
    `Email: ${contactForChat.email}`,
    `LinkedIn: ${contactForChat.linkedin}`,
    `GitHub: ${contactForChat.github}`,
    "",
    "## Skills (summary)",
    skillsSummary.trim(),
    "",
    formatTimeline(experiences, "## Work experience"),
    "",
    formatTimeline(education, "## Education"),
    "",
    "## Featured projects (site showcase)",
    formatProjectsForPrompt(),
    "",
    "## Additional projects (resume highlights)",
    resumeProjects,
    "",
    "## Games & demos",
    gamesNote,
  ].join("\n");
}
