import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Linkedin, Github, Mail, FileText, ExternalLink, Code, Server, Database } from 'lucide-react';

import { PageMeta } from '@/components/PageMeta';
import Section, { SectionHeader } from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import { NowStrip } from '@/components/NowStrip';
import { SkillsCareerTimeline } from '@/components/SkillsCareerTimeline';
import { DeepDiveSection } from '@/components/DeepDiveSection';
import { getFeaturedProjects } from '@/data/projects';
import { heroBio } from '@/data/portfolioContext';
import SkillCard, { Skill } from '@/components/SkillCard';
import ResumeSection from '@/components/ResumeSection';
import SoundCloudPlayer from '@/components/SoundcloudPlayer';
import ContactForm from '@/components/ContactForm';
import Logo from '@/components/Logo';
import Drawings from '@/components/Drawings';
import { Button } from '@/components/ui/button';

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
    name: "Jest/Enzyme", 
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

const images = [
    "https://res.cloudinary.com/dgodidozd/image/upload/v1741665967/Untitled_12_j58ub9.png",
    "https://res.cloudinary.com/dgodidozd/image/upload/v1741665966/IMG_0052_npsjyv.png",
    "https://res.cloudinary.com/dgodidozd/image/upload/v1741666186/Untitled_38_im8syy.png",
    "https://res.cloudinary.com/dgodidozd/image/upload/v1741666187/Untitled_42_yqbnqh.png",
    "https://res.cloudinary.com/dgodidozd/image/upload/v1741666186/Untitled_41_ouzuy3.png"
  ];

const Index = () => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    requestAnimationFrame(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }, [location.hash, reduceMotion]);

  const featured = getFeaturedProjects();

  return (
    <>
      <PageMeta title="David Shibley — Full Stack Developer" path="/" />
    <div className="bg-background relative overflow-hidden">      
      {/* Hero Section */}
      <Section id="home" className="min-h-screen flex items-center pt-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
            >
              <span className="caption inline-block px-4 py-1 border rounded-full mb-6">
                Hello, my name is
              </span>
              <h1 className="heading-xl mb-6">
                <span className="block">David Shibley</span>
                <span className="text-muted-foreground">Full Stack Developer</span>
              </h1>
              <NowStrip />
              <p className="body-lg text-muted-foreground mb-8 max-w-md">
                {heroBio}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  <Link
                    to="/projects"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    View all projects
                  </Link>
                </motion.div>
                <motion.a
                  href="#contact"
                  className="inline-block px-6 py-3 border rounded-lg hover:bg-secondary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  Contact Me
                </motion.a>
              </div>
              
              <div className="flex items-center gap-6 mt-12">
                <a 
                  href="https://linkedin.com/in/davidshibley" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="https://github.com/David-Shibley" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="mailto:davidjshibley@gmail.com" 
                  className="text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Mail size={20} />
                </a>
                <a 
                  href="https://twitch.tv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.2 }}
            className="relative mx-auto"
          >
            <div className="w-80 h-80 md:w-96 md:h-96 glass-card rounded-full flex items-center justify-center">
              <Logo size="lg" className="w-32 h-32" />
            </div>
            <div className="absolute inset-0 border-2 border-primary/10 rounded-full animate-spin-slow motion-reduce:animate-none" />
          </motion.div>
        </div>
        
        <motion.a
          href="#projects"
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-10 h-10 flex items-center justify-center rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: reduceMotion ? 0 : Infinity }}
        >
          <ArrowDown size={20} />
        </motion.a>
      </Section>
      
      {/* Projects Section */}
      <Section id="projects">
        <SectionHeader
          eyebrow="My Work"
          title="Recent projects"
          description="A curated slice of what I ship — games, web apps, and platform work. Filter and browse everything on the projects page."
        />
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        <p className="text-center mt-10">
          <Link
            to="/projects"
            className="inline-flex items-center text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            View all projects with filters
          </Link>
          {" · "}
          <Link
            to="/case-studies"
            className="inline-flex items-center text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Read case studies
          </Link>
        </p>
      </Section>

      <Section id="career-timeline" className="bg-secondary/20">
        <SectionHeader
          eyebrow="Journey"
          title="Interactive career timeline"
          description="Each era maps to the tools and problems I owned — expand a stop to see the skills heatmap for that chapter."
        />
        <SkillsCareerTimeline />
      </Section>

      <Section id='games'>
        <SectionHeader eyebrow='My Work continued' title='Games' description='A list of games I built' />
        <motion.div whileHover={reduceMotion ? undefined : { scale: 1.02 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
          <Button asChild>
            <Link to="/games">See Games</Link>
          </Button>
        </motion.div>
      </Section>
      
      {/* Skills Section */}
      <Section id="skills" className="bg-secondary/30">
        <SectionHeader
          eyebrow="My Expertise"
          title="Skills & Technologies"
          description="I specialize in modern web technologies and frameworks, with experience across the full development stack."
        />
        
        {/* xl: three equal columns; below xl stack categories full-width with 2-col cards so labels aren’t crushed */}
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-3 xl:gap-8">
          <div className="min-w-0">
            <h3 className="heading-sm mb-6">Frontend Development</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {frontendSkills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="heading-sm mb-6">Backend Development</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {backendSkills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index + frontendSkills.length} />
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="heading-sm mb-6">DevOps & Tools</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {devopsSkills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index + frontendSkills.length + backendSkills.length} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="deep-dive">
        <SectionHeader
          eyebrow="Under the hood"
          title="Deep dive: browser Monopoly"
          description="One representative build where game rules, UI modals, and shared state have to stay honest together."
        />
        <DeepDiveSection />
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
          playlistUrl="https://soundcloud.com/a_udio-i_llusion/sets/golden-hour"
          height={300}
          visual={true}
        />
        <SoundCloudPlayer 
          soundCloudUsername="a_udio-i_llusion" 
          playlistUrl="https://soundcloud.com/a_udio-i_llusion/sets/lovable-lullabies"
          height={300}
          visual={true}
        />
        <SoundCloudPlayer 
          soundCloudUsername="a_udio-i_llusion" 
          playlistUrl="https://soundcloud.com/a_udio-i_llusion/sets/rise-and-shine"
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

      <Section id="drawings">
        <SectionHeader
            eyebrow="David's Drawings"
            title="Pencil Drawings"
            description="When not coding, or creating music, David likes to draw. Check out his latest drawings from Cloudinary."
            />

        <Drawings images={images} />
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
    </div>
    </>
  );
};

export default Index;