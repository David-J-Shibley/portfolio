import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ProjectModal from './ProjectModal';

import '../index.css'

export type ProjectKind = "game" | "web" | "professional";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  date: string;
  github?: string;
  team?: string;
  demo?: string;
  features: string[];
  /** For filtering on /projects */
  kind: ProjectKind;
  /** Shown on the home “Recent projects” strip */
  featuredOnHome?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const reduceMotion = useReducedMotion();
  const demoIsInternal = project.demo?.startsWith("/") ?? false;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : index * 0.1,
      }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-400",
        isHovered ? "shadow-lg" : "shadow-sm"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-600 ease-apple group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag) => (
            <span 
              key={tag} 
              className="caption px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="heading-sm mb-2">{project.title}</h3>
        <p className="body-md text-muted-foreground mb-4">{project.description}</p>
        
        <div className="flex items-center justify-between pt-2">
          <motion.button
            onClick={() => setShowModal(true)}
            className="flex items-center text-sm font-medium rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            whileHover={reduceMotion ? undefined : { x: 5 }}
          >
            View details <ChevronRight size={16} className="ml-1" />
          </motion.button>
          
          <div className="flex gap-3">
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="View GitHub repository"
              >
                <Github size={18} />
              </a>
            )}
            {project.demo && demoIsInternal && (
              <Link
                to={project.demo}
                className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 inline-flex"
                aria-label="Open demo"
              >
                <ExternalLink size={18} />
              </Link>
            )}
            {project.demo && !demoIsInternal && (
              <a 
                href={project.demo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="View live demo"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
      {showModal && <ProjectModal project={project} onClose={() => setShowModal(false)} />}
    </motion.div>
  );
};

export default ProjectCard;
