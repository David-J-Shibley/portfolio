import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={{
        duration: reduceMotion ? 0 : 0.4,
        delay: reduceMotion ? 0 : index * 0.05,
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="min-w-0 h-full p-5 rounded-xl border bg-card hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start gap-3 mb-4 min-w-0">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center w-10 h-10 rounded-lg",
            skill.color || "bg-primary/10",
          )}
        >
          {skill.icon}
        </div>
        <h3 className="min-w-0 flex-1 font-medium text-sm leading-snug sm:text-base break-words">
          {skill.name}
        </h3>
      </div>
      
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div 
          className={cn(
            "h-full", 
            skill.color ? `${skill.color}` : "bg-primary"
          )}
          initial={reduceMotion ? false : { width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            delay: reduceMotion ? 0 : 0.2,
          }}
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
