'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Playful Geometric Decorations
 * Floating shapes for visual interest
 */

// Dot Grid Pattern Background
export function DotGridPattern({ className }: { className?: string }) {
  return (
    <div
      className={cn('absolute inset-0 dot-grid pointer-events-none', className)}
      aria-hidden="true"
    />
  );
}

// Floating Circle (outline or filled)
interface FloatingCircleProps {
  size?: number;
  color?: 'teal' | 'gold' | 'terracotta';
  variant?: 'outline' | 'filled';
  className?: string;
  delay?: number;
}

export function FloatingCircle({
  size = 100,
  color = 'teal',
  variant = 'outline',
  className,
  delay = 0,
}: FloatingCircleProps) {
  const colorMap = {
    teal: 'border-teal bg-teal',
    gold: 'border-gold bg-gold',
    terracotta: 'border-terracotta bg-terracotta',
  };

  return (
    <motion.div
      className={cn(
        'absolute rounded-full pointer-events-none',
        variant === 'outline'
          ? `border-2 ${colorMap[color].split(' ')[0]} bg-transparent`
          : `${colorMap[color].split(' ')[1]}/10`,
        className
      )}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -15, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      aria-hidden="true"
    />
  );
}

// Floating Square/Diamond
interface FloatingSquareProps {
  size?: number;
  color?: 'teal' | 'gold' | 'terracotta';
  rotate?: boolean;
  className?: string;
  delay?: number;
}

export function FloatingSquare({
  size = 40,
  color = 'gold',
  rotate = false,
  className,
  delay = 0,
}: FloatingSquareProps) {
  const colorMap = {
    teal: 'bg-teal',
    gold: 'bg-gold',
    terracotta: 'bg-terracotta',
  };

  return (
    <motion.div
      className={cn(
        'absolute rounded-sm pointer-events-none',
        colorMap[color],
        rotate ? 'rotate-45' : '',
        className
      )}
      style={{ width: size, height: size, opacity: 0.15 }}
      animate={{
        y: [0, -10, 0],
        rotate: rotate ? [45, 50, 45] : [0, 5, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      aria-hidden="true"
    />
  );
}

// Floating Triangle
interface FloatingTriangleProps {
  size?: number;
  color?: 'teal' | 'gold' | 'terracotta';
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  delay?: number;
}

export function FloatingTriangle({
  size = 30,
  color = 'terracotta',
  direction = 'up',
  className,
  delay = 0,
}: FloatingTriangleProps) {
  const colorMap = {
    teal: 'border-b-teal',
    gold: 'border-b-gold',
    terracotta: 'border-b-terracotta',
  };

  const rotationMap = {
    up: 0,
    right: 90,
    down: 180,
    left: 270,
  };

  return (
    <motion.div
      className={cn(
        'absolute pointer-events-none',
        'w-0 h-0',
        'border-l-transparent border-r-transparent border-b-[20px]',
        colorMap[color],
        className
      )}
      style={{
        borderLeftWidth: size / 2,
        borderRightWidth: size / 2,
        borderBottomWidth: size,
        transform: `rotate(${rotationMap[direction]}deg)`,
        opacity: 0.2,
      }}
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      aria-hidden="true"
    />
  );
}

// Plus/Cross shape
interface FloatingPlusProps {
  size?: number;
  color?: 'teal' | 'gold' | 'terracotta';
  className?: string;
  delay?: number;
}

export function FloatingPlus({
  size = 20,
  color = 'teal',
  className,
  delay = 0,
}: FloatingPlusProps) {
  const colorMap = {
    teal: 'bg-teal',
    gold: 'bg-gold',
    terracotta: 'bg-terracotta',
  };

  return (
    <motion.div
      className={cn('absolute pointer-events-none', className)}
      style={{ width: size, height: size, opacity: 0.2 }}
      animate={{
        rotate: [0, 90, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      aria-hidden="true"
    >
      {/* Horizontal bar */}
      <div
        className={cn('absolute top-1/2 left-0 w-full h-[3px] -translate-y-1/2 rounded-full', colorMap[color])}
      />
      {/* Vertical bar */}
      <div
        className={cn('absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full', colorMap[color])}
      />
    </motion.div>
  );
}

// Confetti-like scattered shapes
export function GeometricConfetti({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)} aria-hidden="true">
      <FloatingSquare size={24} color="gold" rotate className="top-[10%] left-[5%]" delay={0} />
      <FloatingCircle size={80} color="teal" variant="outline" className="top-[15%] right-[10%]" delay={0.5} />
      <FloatingPlus size={16} color="terracotta" className="top-[30%] left-[15%]" delay={1} />
      <FloatingTriangle size={20} color="gold" direction="up" className="bottom-[20%] right-[20%]" delay={1.5} />
      <FloatingSquare size={32} color="teal" className="bottom-[30%] left-[8%]" delay={2} />
      <FloatingCircle size={40} color="gold" variant="filled" className="top-[60%] right-[5%]" delay={2.5} />
      <FloatingPlus size={24} color="teal" className="bottom-[10%] right-[30%]" delay={3} />
    </div>
  );
}

// Hero section decorations preset
export function HeroDecorations() {
  return (
    <>
      <DotGridPattern />
      <FloatingCircle
        size={200}
        color="teal"
        variant="outline"
        className="top-20 -right-20 lg:right-0"
        delay={0}
      />
      <FloatingCircle
        size={120}
        color="gold"
        variant="outline"
        className="bottom-40 -left-10 lg:left-10"
        delay={1}
      />
      <FloatingSquare
        size={50}
        color="gold"
        rotate
        className="top-40 left-[20%]"
        delay={0.5}
      />
      <FloatingSquare
        size={30}
        color="terracotta"
        rotate
        className="bottom-60 right-[15%]"
        delay={1.5}
      />
      <FloatingTriangle
        size={25}
        color="teal"
        direction="up"
        className="top-[50%] left-[5%]"
        delay={2}
      />
      <FloatingPlus
        size={30}
        color="gold"
        className="top-32 right-[30%]"
        delay={0.8}
      />
      <FloatingPlus
        size={20}
        color="terracotta"
        className="bottom-40 left-[30%]"
        delay={2.5}
      />
    </>
  );
}
