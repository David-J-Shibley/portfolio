import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import '../index.css'

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

const Section = ({ id, className, children }: SectionProps) => {
  return (
    <section
      id={id}
      className={cn("py-20 md:py-32", className)}
    >
      <div className="container px-6 mx-auto">
        {children}
      </div>
    </section>
  );
};

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "max-w-2xl mb-16",
        alignmentClasses[align],
        className
      )}
    >
      {eyebrow && (
        <span className="caption inline-block px-3 py-1 bg-primary/10 text-primary rounded-full mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="heading-lg mb-4">{title}</h2>
      {description && (
        <p className="body-lg text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
};

export default Section;
