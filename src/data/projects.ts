import type { Project } from "@/components/ProjectCard";

export const projects: Project[] = [
  {
    id: "1",
    title: "Chess",
    description: "A game of checkers built with modern web technologies",
    longDescription:
      "A fully functional checkers game with a clean UI, built using Vite, TypeScript, Motion for animations, and Tailwind CSS for styling.",
    image:
      "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=800&q=80",
    tags: ["TypeScript", "Vite", "Motion", "Tailwind CSS"],
    github: "https://github.com/David-Shibley",
    demo: "/chess",
    date: "2025",
    features: [
      "Complete checkers game logic implementation",
      "Smooth animations with Motion",
      "Responsive UI with Tailwind CSS",
      "TypeScript for type safety and better developer experience",
    ],
    kind: "game",
    featuredOnHome: true,
  },
  {
    id: "2",
    title: "Checkers",
    description: "A game of checkers built with modern web technologies",
    longDescription:
      "A fully functional checkers game with a clean UI, built using Vite, TypeScript, Motion for animations, and Tailwind CSS for styling.",
    image:
      "https://www.chesshouse.com/cdn/shop/products/red-black-wood-checkers-set-28291362979927.jpg?v=1628162519&width=2048",
    tags: ["TypeScript", "Vite", "Motion", "Tailwind CSS"],
    github: "https://github.com/David-Shibley",
    demo: "/checkers",
    date: "2025",
    features: [
      "Complete checkers game logic implementation",
      "Smooth animations with Motion",
      "Responsive UI with Tailwind CSS",
      "TypeScript for type safety and better developer experience",
    ],
    kind: "game",
    featuredOnHome: false,
  },
  {
    id: "3",
    title: "Farkle",
    description: "An implementation of the game Farkle",
    longDescription: "Built a simple interpretation of the game Farkle.",
    image:
      "https://imgs.michaels.com/MAM/assets/1/5E3C12034D34434F8A9BAAFDDF0F8E1B/img/9B3D02DD8E294806A6E654C783147154/D327701S_1.jpg",
    tags: ["TypeScript", "Vite", "Motion", "Tailwind CSS"],
    github: "https://github.com/David-Shibley",
    demo: "/farkle",
    date: "2025",
    features: [
      "Comprehensive set of reusable UI components",
      "Consistent design language across applications",
      "Accessibility compliance",
      "Extensive documentation and examples",
    ],
    kind: "game",
    featuredOnHome: false,
  },
  {
    id: "4",
    title: "Daily Site Runner",
    description: "Conveniently opens sites you use everyday",
    longDescription:
      "A practical tool that helps you open your frequently visited websites with a single click, saving time and streamlining your daily workflow.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "JavaScript", "Material-UI", "SCSS"],
    github: "https://github.com/David-Shibley",
    demo: "https://david-shibley.github.io/",
    date: "2022",
    team: "Solo Project",
    features: [
      "Customizable site list for quick access",
      "One-click launch of multiple websites",
      "User-friendly interface with Material-UI components",
      "Responsive design for all devices",
    ],
    kind: "web",
    featuredOnHome: true,
  },
  {
    id: "5",
    title: "Royal Oaks Services",
    description: "Volunteered to build a website for a non-profit organization",
    longDescription:
      "A website built for a non-profit organization to help them establish an online presence and better serve their community.",
    image:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "JavaScript", "Material-UI", "SCSS"],
    github: "https://github.com/David-Shibley",
    demo: "https://royaloaksservices.github.io/",
    date: "2022",
    team: "Solo Project",
    features: [
      "Information about the organization and its services",
      "Contact form for inquiries",
      "Responsive design for all devices",
      "Easy-to-update content management for non-technical staff",
    ],
    kind: "web",
    featuredOnHome: true,
  },
  {
    id: "6",
    title: "Enterprise Integrations & Shopify Fulfillment",
    description: "Lead engineer for GoPuff's platform as a service (PaaS) initiative",
    longDescription:
      "Converted GoPuff from an ecommerce site into a platform as a service, generating close to $150 million in the first year.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    tags: ["TypeScript", "React", "Node", "Redis", "Azure", "Docker"],
    github: "https://github.com/David-Shibley",
    date: "2021 - 2022",
    team: "Tech Lead (Team of 5)",
    demo: "https://www.poweredbygopuff.com/pages/fulfillment",
    features: [
      "Custom OpenTelemetry implementation with Datadog for business insights",
      "Integration with major e-commerce platforms",
      "Shopify fulfillment application",
      "Real-time monitoring and alerts via PagerDuty",
    ],
    kind: "professional",
    featuredOnHome: true,
  },
];

export const projectKindLabels: Record<Project["kind"], string> = {
  game: "Games",
  web: "Web apps",
  professional: "Professional",
};

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featuredOnHome);
}
