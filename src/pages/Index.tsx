import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Linkedin, Github, Mail, FileText, ExternalLink, Code, Server, Database, Palette } from 'lucide-react';

import Navigation from '@/components/Navigation';
import Section, { SectionHeader } from '@/components/Section';
import ProjectCard, { Project } from '@/components/ProjectCard';
import SkillCard, { Skill } from '@/components/SkillCard';
import ResumeSection from '@/components/ResumeSection';
import SoundCloudPlayer from '@/components/SoundcloudPlayer';
import ContactForm from '@/components/ContactForm';
import Logo from '@/components/Logo';

const projects: Project[] = [
  {
    id: "1",
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
    ]
  },
  {
    id: "2",
    title: "Checkers",
    description: "A game of checkers built with modern web technologies",
    longDescription: "A fully functional checkers game with a clean UI, built using Vite, TypeScript, Motion for animations, and Tailwind CSS for styling.",
    image: "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=800&q=80",
    tags: ["TypeScript", "Vite", "Motion", "Tailwind CSS"],
    github: "https://github.com/David-Shibley",
    date: "2023",
    features: [
      "Complete checkers game logic implementation",
      "Smooth animations with Motion",
      "Responsive UI with Tailwind CSS",
      "TypeScript for type safety and better developer experience"
    ]
  },
  {
    id: "3",
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
    ]
  },
  {
    id: "4",
    title: "Enterprise Integrations & Shopify Fulfillment",
    description: "Lead engineer for GoPuff's platform as a service (PaaS) initiative",
    longDescription: "Converted GoPuff from an ecommerce site into a platform as a service, generating close to $150 million in the first year.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    tags: ["TypeScript", "React", "Node", "Redis", "Azure", "Docker"],
    github: "https://github.com/David-Shibley",
    date: "2021 - 2022",
    team: "Tech Lead (Team of 5)",
    features: [
      "Custom OpenTelemetry implementation with Datadog for business insights",
      "Integration with major e-commerce platforms",
      "Shopify fulfillment application",
      "Real-time monitoring and alerts via PagerDuty"
    ]
  },
  {
    id: "5",
    title: "Pharmacy Management System",
    description: "HIPAA compliant solution for pharmacy management",
    longDescription: "Built a HIPAA compliant solution to an unforeseen business requirement with a shippable product ready for use within ten days.",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
    tags: ["TypeScript", "React", "Redis", "SignalR", "C#/.NET", "Azure"],
    github: "https://github.com/David-Shibley",
    date: "2022",
    team: "Lead Engineer",
    features: [
      "HIPAA compliant data handling with Redis cache",
      "Real-time notifications via SignalR",
      "Internal administration tools",
      "Support for remote pharmacy management"
    ]
  },
  {
    id: "6",
    title: "MineralUI Component Library",
    description: "Reusable React component library that became CA's UI standard",
    longDescription: "Built an internal custom component library that was adopted by CA when they acquired Rally and made it their UI standard.",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=800&q=80",
    tags: ["JavaScript", "React", "HTML5", "CSS"],
    github: "https://github.com/mineral-ui/mineral-ui",
    demo: "https://mineral-ui.netlify.app/",
    date: "2016 - 2021",
    team: "Broadcom Team",
    features: [
      "Comprehensive set of reusable UI components",
      "Consistent design language across applications",
      "Accessibility compliance",
      "Extensive documentation and examples"
    ]
  },
];

const frontendSkills: Skill[] = [
  { 
    name: "JavaScript/ES7", 
    icon: <Code size={20} className="text-yellow-500" />, 
    level: 95,
    color: "bg-yellow-500" 
  },
  { 
    name: "TypeScript", 
    icon: <Code size={20} className="text-blue-600" />, 
    level: 90,
    color: "bg-blue-600" 
  },
  { 
    name: "React", 
    icon: <Code size={20} className="text-blue-500" />, 
    level: 95,
    color: "bg-blue-500" 
  },
  { 
    name: "Angular", 
    icon: <Code size={20} className="text-red-600" />, 
    level: 85,
    color: "bg-red-600" 
  },
  { 
    name: "HTML/CSS/SCSS", 
    icon: <Code size={20} className="text-orange-500" />, 
    level: 90,
    color: "bg-orange-500" 
  },
  { 
    name: "Jest/Jasmine/Enzyme", 
    icon: <Code size={20} className="text-green-500" />, 
    level: 85,
    color: "bg-green-500" 
  },
];

const backendSkills: Skill[] = [
  { 
    name: "Node.js", 
    icon: <Server size={20} className="text-green-600" />, 
    level: 90,
    color: "bg-green-600" 
  },
  { 
    name: "Ruby", 
    icon: <Server size={20} className="text-red-500" />, 
    level: 85,
    color: "bg-red-500" 
  },
  { 
    name: "C#/.NET", 
    icon: <Server size={20} className="text-purple-600" />, 
    level: 80,
    color: "bg-purple-600" 
  },
  { 
    name: "Python", 
    icon: <Server size={20} className="text-blue-500" />, 
    level: 75,
    color: "bg-blue-500" 
  },
  { 
    name: "PostgreSQL", 
    icon: <Database size={20} className="text-blue-700" />, 
    level: 85,
    color: "bg-blue-700" 
  },
  { 
    name: "Redis", 
    icon: <Database size={20} className="text-red-600" />, 
    level: 85,
    color: "bg-red-600" 
  },
];

const devopsSkills: Skill[] = [
  { 
    name: "AWS", 
    icon: <Server size={20} className="text-orange-500" />, 
    level: 80,
    color: "bg-orange-500" 
  },
  { 
    name: "Azure", 
    icon: <Server size={20} className="text-blue-500" />, 
    level: 85,
    color: "bg-blue-500" 
  },
  { 
    name: "Docker", 
    icon: <Server size={20} className="text-blue-600" />, 
    level: 80,
    color: "bg-blue-600" 
  },
  { 
    name: "Datadog", 
    icon: <Server size={20} className="text-purple-500" />, 
    level: 85,
    color: "bg-purple-500" 
  },
  { 
    name: "Jenkins", 
    icon: <Server size={20} className="text-red-500" />, 
    level: 75,
    color: "bg-red-500" 
  },
  { 
    name: "Git/GitHub", 
    icon: <Code size={20} className="text-gray-700" />, 
    level: 90,
    color: "bg-gray-700" 
  }
];

const tracks = [
  {
    id: "1",
    title: "Dream Sequence",
    artist: "a_udio-i_llusion",
    artwork: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    soundCloudUrl: "https://soundcloud.com/a_udio-i_llusion",
  },
  {
    id: "2",
    title: "Urban Rhythm",
    artist: "a_udio-i_llusion",
    artwork: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    soundCloudUrl: "https://soundcloud.com/a_udio-i_llusion",
  },
  {
    id: "3",
    title: "Electronic Waves",
    artist: "a_udio-i_llusion",
    artwork: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    soundCloudUrl: "https://soundcloud.com/a_udio-i_llusion",
  },
  {
    id: "4",
    title: "Sunset Vibes",
    artist: "a_udio-i_llusion",
    artwork: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    soundCloudUrl: "https://soundcloud.com/a_udio-i_llusion",
  },
];

const Index = () => {
  return (
    <main className="bg-background relative overflow-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <Section id="home" className="min-h-screen flex items-center pt-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="caption inline-block px-4 py-1 border rounded-full mb-6">
                Hello, my name is
              </span>
              <h1 className="heading-xl mb-6">
                <span className="block">David Shibley</span>
                <span className="text-muted-foreground">Full Stack Developer</span>
              </h1>
              <p className="body-lg text-muted-foreground mb-8 max-w-md">
                I create elegant, robust web applications with a focus on user experience. As a seasoned developer with experience at Contentful, PrimeTrust, GoPuff, and Broadcom, I bring creative solutions to complex problems.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="#projects"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View My Work
                </motion.a>
                <motion.a
                  href="#contact"
                  className="px-6 py-3 border rounded-lg hover:bg-secondary transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Me
                </motion.a>
              </div>
              
              <div className="flex items-center gap-6 mt-12">
                <a 
                  href="https://linkedin.com/in/davidshibley" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="https://github.com/David-Shibley" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="mailto:davidjshibley@gmail.com" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail size={20} />
                </a>
                <a 
                  href="https://twitch.tv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto"
          >
            <div className="w-80 h-80 md:w-96 md:h-96 glass-card rounded-full flex items-center justify-center">
              <Logo size="lg" className="w-32 h-32" />
            </div>
            <div className="absolute inset-0 border-2 border-primary/10 rounded-full animate-spin-slow" />
          </motion.div>
        </div>
        
        <motion.a
          href="#projects"
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-10 h-10 flex items-center justify-center rounded-full border"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={20} />
        </motion.a>
      </Section>
      
      {/* Projects Section */}
      <Section id="projects">
        <SectionHeader
          eyebrow="My Work"
          title="Recent Projects"
          description="A showcase of my latest web development projects, from enterprise solutions to personal projects."
        />
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </Section>
      
      {/* Skills Section */}
      <Section id="skills" className="bg-secondary/30">
        <SectionHeader
          eyebrow="My Expertise"
          title="Skills & Technologies"
          description="I specialize in modern web technologies and frameworks, with experience across the full development stack."
        />
        
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="heading-sm mb-6">Frontend Development</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {frontendSkills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="heading-sm mb-6">Backend Development</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {backendSkills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index + frontendSkills.length} />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="heading-sm mb-6">DevOps & Tools</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {devopsSkills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index + frontendSkills.length + backendSkills.length} />
              ))}
            </div>
          </div>
        </div>
      </Section>
      
      {/* Resume Section */}
      <Section id="resume">
        <SectionHeader
          eyebrow="Experience & Education"
          title="Professional Journey"
          description="My academic and professional background in software development and web technologies."
        />
        
        <ResumeSection />
      </Section>
      
      {/* Music Section */}
      <Section id="music" className="bg-secondary/30">
        <SectionHeader
          eyebrow="David's Music"
          title="SoundCloud Tracks"
          description="When not coding, David creates music. Check out his latest tracks on SoundCloud."
        />
        
        <SoundCloudPlayer 
          soundCloudUsername="a_udio-i_llusion" 
          playlistUrl="https://soundcloud.com/a_udio-i_llusion/sets/beauty-in-the-darkness"
          height={300}
          visual={true}
        />
        <SoundCloudPlayer 
          soundCloudUsername="a_udio-i_llusion" 
          playlistUrl="https://soundcloud.com/a_udio-i_llusion/sets/best-rappers-unalive"
          height={300}
          visual={true}
        />
      </Section>
      
      {/* Contact Section */}
      <Section id="contact">
        <SectionHeader
          eyebrow="Get In Touch"
          title="Contact Me"
          description="Have a project in mind or want to discuss collaboration opportunities? Send me a message and I'll get back to you as soon as possible."
        />
        
        <ContactForm />
      </Section>
      
      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="font-medium">David Shibley</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} David Shibley. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <a 
                href="https://linkedin.com/in/davidshibley" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://github.com/David-Shibley" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={18} />
              </a>
              <a 
                href="mailto:davidjshibley@gmail.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail size={18} />
              </a>
              <a 
                href="https://docs.google.com/document/d/e/2PACX-1vS0i6pHL3jLAW56qwn95zFynF8krNK76zoSI1H_wXbaGaH7OmAiQ4b_smwz6YJL-iwHJyxMZwmd4BN8/pub?format=pdf" 
                download
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText size={18} />
              </a>
              <a 
                href="https://twitch.tv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;