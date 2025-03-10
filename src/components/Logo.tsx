import { cn } from '@/lib/utils';

import '../index.css'

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={cn(
      "relative flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold transition-all duration-300 hover:rotate-3",
      sizeClasses[size],
      className
    )}>
      <span className="select-none">DS</span>
      <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-slow"></div>
    </div>
  );
};

export default Logo;
