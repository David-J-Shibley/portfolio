import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Github, ExternalLink } from 'lucide-react';
import { Project } from "./ProjectCard"

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
      ref={modalRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full p-6 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ color: 'black' }}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Project Image */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Project Details */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{project.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{project.date}</p>

          <p className="mt-3 text-gray-700 dark:text-gray-300">
            {project.longDescription}
          </p>

          {/* Features */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2">
              {project.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="mt-6 flex gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                <Github size={18} /> GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
              >
                <ExternalLink size={18} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectModal;