import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import '../index.css'

export interface Skill {
  name: string;
  icon: React.ReactNode;
  level: number;
  color?: string;
}

interface SkillCardProps {
  skill: Skill;
  index: number;
}

const SkillCard = ({ skill, index, }: SkillCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true, margin: "-50px" }}
      className="p-5 rounded-xl border bg-card hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg",
          skill.color || "bg-primary/10"
        )}>
          {skill.icon}
        </div>
        <h3 className="font-medium">{skill.name}</h3>
      </div>
      
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div 
          className={cn(
            "h-full", 
            skill.color ? `${skill.color}` : "bg-primary"
          )}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        />
      </div>
      <div className="mt-2 text-right text-sm text-muted-foreground">
        {skill.level}%
      </div>
    </motion.div>
  );
};

export default SkillCard;
