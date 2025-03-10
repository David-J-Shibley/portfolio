import React from 'react';
import { motion } from 'framer-motion';
import { Download, Briefcase, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineItemProps {
  date: string;
  title: string;
  organization: string;
  description: string[];
  type: 'education' | 'experience';
  index: number;
}

const TimelineItem = ({ date, title, organization, description, type, index }: TimelineItemProps) => {
  return (
    <motion.div
      className="relative pl-10 pb-10 last:pb-0"
      initial={{ opacity: 0, x: type === 'education' ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Timeline line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
      
      {/* Timeline icon */}
      <div className={cn(
        "absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center",
        type === 'education' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
      )}>
        {type === 'education' ? (
          <GraduationCap size={16} />
        ) : (
          <Briefcase size={16} />
        )}
      </div>
      
      {/* Content */}
      <div>
        <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary rounded-full mb-2">
          {date}
        </span>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <div className="text-muted-foreground mb-2">{organization}</div>
        <ul className="text-muted-foreground list-disc list-inside">
          {description.map((item, i) => (
            <li key={i} className="mb-1">{item}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const ResumeSection = () => {
  const experiences = [
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
      type: 'experience' as const,
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
      type: 'experience' as const,
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
      type: 'experience' as const,
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
      type: 'experience' as const,
    },
  ];

  const education = [
    {
      date: "August 2015 - April 2016",
      title: "Full Stack Web Development",
      organization: "Galvanize, Denver",
      description: [
        "Web-dev bootcamp. MEAN/PEAN stack with a language agnostic approach."
      ],
      type: 'education' as const,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="heading-sm">Experience</h3>
          <motion.a
            href="/resume.pdf"
            download
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={16} />
            Download CV
          </motion.a>
        </div>
        
        <div>
          {experiences.map((experience, index) => (
            <TimelineItem
              key={`${experience.title}-${index}`}
              {...experience}
              index={index}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="heading-sm mb-8">Education</h3>
        
        <div>
          {education.map((edu, index) => (
            <TimelineItem
              key={`${edu.title}-${index}`}
              {...edu}
              index={index}
            />
          ))}
        </div>
        
        <div className="mt-10">
          <h3 className="heading-sm mb-6">Projects</h3>
          <div className="space-y-6">
            <div className="border rounded-lg p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">Daily Site Runner</h4>
              </div>
              <p className="text-muted-foreground mb-2">Conveniently opens sites you use everyday</p>
              <p className="text-sm text-muted-foreground">Tech: ES7, HTML5, CRA, React functional components, Material-UI, SCSS</p>
            </div>
            
            <div className="border rounded-lg p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">Checkers</h4>
              </div>
              <p className="text-muted-foreground mb-2">A game of checkers</p>
              <p className="text-sm text-muted-foreground">Tech: Vite, TypeScript, Motion, Tailwind</p>
            </div>
            
            <div className="border rounded-lg p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">Royal Oaks Services</h4>
              </div>
              <p className="text-muted-foreground mb-2">Volunteered to build a website for a non-profit</p>
              <p className="text-sm text-muted-foreground">Tech: ES7, HTML5, CRA, React functional components, Material-UI, SCSS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeSection;