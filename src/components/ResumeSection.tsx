import React from 'react';
import { motion } from 'framer-motion';
import { Download, Briefcase, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  education,
  experiences,
  resumeSidebarProjects,
} from '@/data/portfolioContext';

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
  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="heading-sm">Experience</h3>
          <motion.a
            href="https://docs.google.com/document/d/e/2PACX-1vS0i6pHL3jLAW56qwn95zFynF8krNK76zoSI1H_wXbaGaH7OmAiQ4b_smwz6YJL-iwHJyxMZwmd4BN8/pub?format=pdf"
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
            {resumeSidebarProjects.map((p) => (
              <div key={p.title} className="border rounded-lg p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-lg">{p.title}</h4>
                </div>
                <p className="text-muted-foreground mb-2">{p.summary}</p>
                <p className="text-sm text-muted-foreground">Tech: {p.tech}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeSection;