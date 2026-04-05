// server/index.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// src/data/caseStudies.ts
var caseStudies = [
  {
    slug: "gopuff-paas",
    title: "GoPuff: enterprise PaaS & Shopify fulfillment",
    subtitle: "Platform engineering at scale",
    excerpt: "Turning a single-brand storefront into a fulfillment and integrations platform that partners could adopt\u2014with observability, compliance, and revenue impact.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    tags: ["TypeScript", "React", "Node", "Azure", "Redis", "Datadog"]
  },
  {
    slug: "contentful-marketplace",
    title: "Contentful Marketplace",
    subtitle: "Third-party apps, listings, and install flows",
    excerpt: "End-to-end work on a marketplace where customers discover apps, understand capabilities, and complete installation with trustworthy auth and operational clarity.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    tags: ["TypeScript", "React", "Node", "Postgres", "AWS"]
  }
];
var caseStudyMarkdown = {
  "gopuff-paas": `
## Context

GoPuff needed to move beyond a single consumer storefront: partners and brands wanted to plug into fulfillment and commerce capabilities without rebuilding the stack each time. The goal was a **platform-as-a-service** posture\u2014repeatable APIs, operational visibility, and a path to onboard external businesses safely.

## What I owned

- **Technical leadership** for enterprise integrations and the **Shopify fulfillment** initiative, working closely with product and stakeholders while supporting a small engineering team.
- **Full-stack delivery** across TypeScript, React, Node, Redis, Azure, and Docker\u2014balancing speed with reliability for money-moving flows.
- **Observability** via a **custom OpenTelemetry** integration with **Datadog**, oriented toward business insights (not only red/green dashboards) and feeding downstream needs such as ads-related analytics.

## Architecture & delivery themes

- **Service boundaries** that could evolve as the platform grew\u2014clear contracts for integrations and fulfillment workflows.
- **Redis and real-time patterns** where latency and coordination mattered for operational tooling and customer-facing experiences.
- **Azure-first deployment** with containerized services and pragmatic DevOps practices (including **PagerDuty** for incident response).

## HIPAA pharmacy initiative (parallel track)

I also led engineering on a **HIPAA-aligned pharmacy management system** (TypeScript, React, Redis, SignalR, C#/.NET, Postgres, Azure). A major outcome was pushing toward **high automation** in pharmacy operations\u2014reducing manual toil while staying inside strict compliance constraints.

## Outcomes (as stated publicly on the portfolio)

The PaaS / fulfillment direction was tied to **significant revenue impact in its first year** (on the order of **nine figures**). The deeper win was establishing a **repeatable platform pattern**: integrations, monitoring, and operational playbooks that teams could extend without heroics.

## What I\u2019d emphasize in an interview

- Turning ambiguous \u201Cwe should be a platform\u201D intent into **shippable slices** with measurable adoption.
- Making observability **legible to the business**, not only engineering.
- Leading through **technical depth** and **execution hygiene** (incidents, ownership, and cross-team alignment).
`.trim(),
  "contentful-marketplace": `
## Context

Contentful\u2019s **Marketplace** is where customers find third-party apps that extend the product: integrations, workflows, and ecosystem value. The surface area spans **discovery** (listings), **trust** (what an app can do), and **installation** (auth and safe onboarding into customer organizations).

## What I worked on

- **Marketplace product engineering**: building and maintaining customer-facing experiences that make it easy to understand, compare, and install apps.
- **APIs and UI** supporting **app listings**, **installation flows**, and **authentication mechanisms**\u2014the parts that must feel boringly reliable because they touch customer data and org boundaries.
- **Developer experience** improvements for teams integrating external services with Contentful\u2014reducing friction in the \u201Chappy path\u201D and making failure modes understandable.

## Platform & reliability

- **Core ecosystem infrastructure** on **AWS** with **Node** and **TypeScript**, emphasizing maintainability across many app partners and internal teams.
- **Observability and monitoring** for production services using **AWS-native tooling**, so regressions are caught early and incidents are actionable.

## What \u201Cgood\u201D looked like

- A marketplace that feels **cohesive with the core product**\u2014not a separate mini-site with different rules.
- Installation flows that are **explicit, reversible where possible**, and **safe-by-default** for admins making org-wide decisions.
- Internal velocity: engineers can extend listing and install surfaces without re-learning a bespoke stack each time.

## Interview narrative

I\u2019d focus on **ecosystem thinking**: third-party apps introduce versioning, trust, and long-tail edge cases. The engineering challenge is building **opinionated frameworks** (for listings, permissions, and install) that still leave room for partners to innovate\u2014without turning the Marketplace into endless one-offs.
`.trim()
};

// src/data/projects.ts
var projects = [
  {
    id: "1",
    title: "Chess",
    description: "A game of checkers built with modern web technologies",
    longDescription: "A fully functional checkers game with a clean UI, built using Vite, TypeScript, Motion for animations, and Tailwind CSS for styling.",
    image: "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=800&q=80",
    tags: ["TypeScript", "Vite", "Motion", "Tailwind CSS"],
    github: "https://github.com/David-Shibley",
    demo: "/chess",
    date: "2025",
    features: [
      "Complete checkers game logic implementation",
      "Smooth animations with Motion",
      "Responsive UI with Tailwind CSS",
      "TypeScript for type safety and better developer experience"
    ],
    kind: "game",
    featuredOnHome: true
  },
  {
    id: "2",
    title: "Checkers",
    description: "A game of checkers built with modern web technologies",
    longDescription: "A fully functional checkers game with a clean UI, built using Vite, TypeScript, Motion for animations, and Tailwind CSS for styling.",
    image: "https://www.chesshouse.com/cdn/shop/products/red-black-wood-checkers-set-28291362979927.jpg?v=1628162519&width=2048",
    tags: ["TypeScript", "Vite", "Motion", "Tailwind CSS"],
    github: "https://github.com/David-Shibley",
    demo: "/checkers",
    date: "2025",
    features: [
      "Complete checkers game logic implementation",
      "Smooth animations with Motion",
      "Responsive UI with Tailwind CSS",
      "TypeScript for type safety and better developer experience"
    ],
    kind: "game",
    featuredOnHome: false
  },
  {
    id: "3",
    title: "Farkle",
    description: "An implementation of the game Farkle",
    longDescription: "Built a simple interpretation of the game Farkle.",
    image: "https://imgs.michaels.com/MAM/assets/1/5E3C12034D34434F8A9BAAFDDF0F8E1B/img/9B3D02DD8E294806A6E654C783147154/D327701S_1.jpg",
    tags: ["TypeScript", "Vite", "Motion", "Tailwind CSS"],
    github: "https://github.com/David-Shibley",
    demo: "/farkle",
    date: "2025",
    features: [
      "Comprehensive set of reusable UI components",
      "Consistent design language across applications",
      "Accessibility compliance",
      "Extensive documentation and examples"
    ],
    kind: "game",
    featuredOnHome: false
  },
  {
    id: "4",
    title: "Daily Site Runner",
    description: "Conveniently opens sites you use everyday",
    longDescription: "A practical tool that helps you open your frequently visited websites with a single click, saving time and streamlining your daily workflow.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "JavaScript", "Material-UI", "SCSS"],
    github: "https://github.com/David-Shibley",
    demo: "https://david-shibley.github.io/",
    date: "2022",
    team: "Solo Project",
    features: [
      "Customizable site list for quick access",
      "One-click launch of multiple websites",
      "User-friendly interface with Material-UI components",
      "Responsive design for all devices"
    ],
    kind: "web",
    featuredOnHome: true
  },
  {
    id: "5",
    title: "Royal Oaks Services",
    description: "Volunteered to build a website for a non-profit organization",
    longDescription: "A website built for a non-profit organization to help them establish an online presence and better serve their community.",
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "JavaScript", "Material-UI", "SCSS"],
    github: "https://github.com/David-Shibley",
    demo: "https://royaloaksservices.github.io/",
    date: "2022",
    team: "Solo Project",
    features: [
      "Information about the organization and its services",
      "Contact form for inquiries",
      "Responsive design for all devices",
      "Easy-to-update content management for non-technical staff"
    ],
    kind: "web",
    featuredOnHome: true
  },
  {
    id: "6",
    title: "Enterprise Integrations & Shopify Fulfillment",
    description: "Lead engineer for GoPuff's platform as a service (PaaS) initiative",
    longDescription: "Converted GoPuff from an ecommerce site into a platform as a service, generating close to $150 million in the first year.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    tags: ["TypeScript", "React", "Node", "Redis", "Azure", "Docker"],
    github: "https://github.com/David-Shibley",
    date: "2021 - 2022",
    team: "Tech Lead (Team of 5)",
    demo: "https://www.poweredbygopuff.com/pages/fulfillment",
    features: [
      "Custom OpenTelemetry implementation with Datadog for business insights",
      "Integration with major e-commerce platforms",
      "Shopify fulfillment application",
      "Real-time monitoring and alerts via PagerDuty"
    ],
    kind: "professional",
    featuredOnHome: true
  }
];

// src/data/portfolioContext.ts
var heroBio = "I create elegant, robust web applications with a focus on user experience. As a seasoned developer with experience at Contentful, PrimeTrust, GoPuff, and Broadcom, I bring creative solutions to complex problems.";
var contactForChat = {
  name: "David Shibley",
  role: "Full Stack Developer",
  linkedin: "https://linkedin.com/in/davidshibley",
  github: "https://github.com/David-Shibley",
  email: "davidjshibley@gmail.com"
};
var skillsSummary = `
Frontend: JavaScript/ES7, TypeScript, React, Angular, HTML/CSS/SCSS, Jest/Enzyme
Backend: Node.js, Ruby, C#/.NET, Python, PostgreSQL, Redis
DevOps & tools: AWS, Azure, Docker, Datadog, Jenkins, Git/GitHub
`;
var gamesNote = "This portfolio includes many browser games (chess, checkers, monopoly, snake, invaders, and more) under the /games route and individual paths like /chess, /checkers, /monopoly, etc.";
var experiences = [
  {
    date: "October 2023 - Present",
    title: "Software Engineer III",
    organization: "Contentful",
    description: [
      "Developed and maintained Contentful's Marketplace, enabling seamless third-party app integrations using TypeScript, React, Node, and Postgres.",
      "Designed and implemented APIs and UI components to support app listings, installation workflows, and authentication mechanisms.",
      "Improved developer experience by streamlining the process of integrating external services with Contentful.",
      "Built and maintained core infrastructure supporting Contentful's ecosystem using AWS, Node, TypeScript.",
      "Enhanced observability and monitoring for production services using AWS-native tools."
    ],
    type: "experience"
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
      "Managed production resources and contributed to Terraform infrastructure."
    ],
    type: "experience"
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
      "Built the world's first fully automated pharmacy which allowed multiple pharmacies to be operated by a single pharmacist."
    ],
    type: "experience"
  },
  {
    date: "April 2016 - January 2021",
    title: "Software Engineer",
    organization: "Broadcom",
    description: [
      "Supported Rally - a collaborative, enterprise SaaS platform for agile development using JavaScript, React, Redux, Java, Postgres, Ruby, Bash, RedHat.",
      "Lead multiple code upgrades and built two custom end-to-end testing frameworks.",
      "Created MineralUI - a reusable React component library that became CA's UI standard after acquisition."
    ],
    type: "experience"
  }
];
var education = [
  {
    date: "August 2015 - April 2016",
    title: "Full Stack Web Development",
    organization: "Galvanize, Denver",
    description: [
      "Web-dev bootcamp. MEAN/PEAN stack with a language agnostic approach."
    ],
    type: "education"
  }
];
var resumeSidebarProjects = [
  {
    title: "Daily Site Runner",
    summary: "Conveniently opens sites you use everyday",
    tech: "ES7, HTML5, CRA, React functional components, Material-UI, SCSS"
  },
  {
    title: "Checkers",
    summary: "A game of checkers",
    tech: "Vite, TypeScript, Motion, Tailwind"
  },
  {
    title: "Royal Oaks Services",
    summary: "Volunteered to build a website for a non-profit",
    tech: "ES7, HTML5, CRA, React functional components, Material-UI, SCSS"
  }
];
function formatTimeline(entries, heading) {
  const blocks = entries.map(
    (e) => `${e.date} \u2014 ${e.title} at ${e.organization}
` + e.description.map((d) => `  - ${d}`).join("\n")
  );
  return `${heading}
${blocks.join("\n\n")}`;
}
function formatProjectsForPrompt() {
  return projects.map((p) => {
    const lines = [
      `${p.title} (${p.date})`,
      p.description,
      p.longDescription,
      p.team ? `Team: ${p.team}` : null,
      p.tags.length ? `Tags: ${p.tags.join(", ")}` : null,
      p.demo ? `Demo: ${p.demo}` : null,
      p.features.length ? `Highlights:
${p.features.map((f) => `  - ${f}`).join("\n")}` : null
    ].filter(Boolean);
    return lines.join("\n");
  }).join("\n\n---\n\n");
}
function buildChatSystemPrompt() {
  const resumeProjects = resumeSidebarProjects.map((p) => `${p.title}: ${p.summary}. Tech: ${p.tech}`).join("\n");
  return [
    `You are ${contactForChat.name}, a ${contactForChat.role}. You are speaking in first person with visitors to your portfolio site.`,
    "Stay in character as David. Be warm, professional, and concise unless the visitor asks for detail.",
    "Ground your answers ONLY in the context below. If something is not covered here, say you would rather follow up by email or LinkedIn and give the contact info.",
    "You are an AI assistant representing David \u2014 if asked directly, acknowledge that you are an AI trained on his public portfolio content, not a live chat.",
    "Format answers with Markdown the site can render: put a blank line before bullet lists, one list item per line starting with '- ', use **bold** for short labels, and use short paragraphs.",
    "",
    "## Currently",
    "- At Contentful: working on the Translations product.",
    "- Side projects: building AI-integrated tools, including Grocery Goblin (https://www.grocerygoblin.com).",
    "",
    "## Case studies on this site",
    ...caseStudies.map(
      (c) => `- **${c.title}** (${c.slug}): ${c.excerpt}`
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
    gamesNote
  ].join("\n");
}

// src/server/chatRateLimit.ts
var WINDOW_MS = Number(process.env.CHAT_RATE_LIMIT_WINDOW_MS ?? 6e4);
var MAX_REQUESTS = Number(process.env.CHAT_RATE_LIMIT_MAX ?? 24);
var buckets = /* @__PURE__ */ new Map();
var ChatRateLimitError = class extends Error {
  constructor() {
    super("CHAT_RATE_LIMIT_EXCEEDED");
    this.name = "ChatRateLimitError";
  }
};
function pruneAndCount(timestamps, now) {
  const cutoff = now - WINDOW_MS;
  return timestamps.filter((t) => t > cutoff);
}
function consumeChatRateToken(clientKey) {
  const now = Date.now();
  const prev = buckets.get(clientKey) ?? [];
  const next = pruneAndCount(prev, now);
  if (next.length >= MAX_REQUESTS) {
    throw new ChatRateLimitError();
  }
  next.push(now);
  buckets.set(clientKey, next);
}
function getClientKeyFromIncoming(headers, remoteAddress) {
  const xff = headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = headers["x-real-ip"];
  if (typeof xri === "string" && xri.length > 0) return xri.trim();
  if (remoteAddress && remoteAddress.length > 0) return remoteAddress;
  return "unknown";
}

// src/server/featherlessChat.ts
var FEATHERLESS_URL = "https://api.featherless.ai/v1/chat/completions";
function getModel() {
  return process.env.FEATHERLESS_MODEL ?? "Qwen/Qwen2.5-7B-Instruct";
}
async function handleChatRequest(body, options) {
  if (options?.clientKey) {
    consumeChatRateToken(options.clientKey);
  }
  const apiKey = process.env.FEATHERLESS_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error("FEATHERLESS_API_KEY is not configured");
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    throw new Error("messages must be a non-empty array");
  }
  for (const m of body.messages) {
    if (!m || m.role !== "user" && m.role !== "assistant" || typeof m.content !== "string") {
      throw new Error("invalid message shape");
    }
  }
  const system = buildChatSystemPrompt();
  const messages = [
    { role: "system", content: system },
    ...body.messages.map((m) => ({ role: m.role, content: m.content }))
  ];
  const res = await fetch(FEATHERLESS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: getModel(),
      messages,
      max_tokens: 1024,
      temperature: 0.7
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Featherless error ${res.status}: ${errText.slice(0, 500)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("empty model response");
  }
  return { message: content };
}

// server/index.ts
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var app = express();
var port = Number(process.env.PORT) || 8080;
app.disable("x-powered-by");
app.use(express.json({ limit: "256kb" }));
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});
app.post("/api/chat", async (req, res) => {
  try {
    const clientKey = getClientKeyFromIncoming(
      req.headers,
      req.socket.remoteAddress
    );
    const result = await handleChatRequest(req.body, {
      clientKey
    });
    res.json(result);
  } catch (e) {
    if (e instanceof ChatRateLimitError) {
      return res.status(429).json({
        error: "Too many messages. Please wait a minute and try again."
      });
    }
    const message = e instanceof Error ? e.message : "Chat failed";
    const isConfig = message.includes("FEATHERLESS_API_KEY");
    res.status(isConfig ? 503 : 500).json({
      error: isConfig ? "Chat is not configured." : message
    });
  }
});
var distDir = path.join(__dirname, "dist");
app.use(express.static(distDir, { index: false }));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});
app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on http://0.0.0.0:${port}`);
});
