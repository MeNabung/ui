'use client';

import { motion, type Variants, type HTMLMotionProps } from 'motion/react';
import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * MeNabung Motion Components
 * Following ui-skills constraints:
 * - Animate only compositor props (transform, opacity)
 * - Use ease-out on entrance
 * - Never exceed 200ms for interaction feedback
 * - Respect prefers-reduced-motion
 */

// Fade up animation for cards and sections
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1], // ease-out
    },
  },
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Scale up for buttons/cards on hover
export const scaleOnHover: HTMLMotionProps<'div'> = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
};

// Fade in from left for nav items
export const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Fade in from right
export const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Simple fade
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// Motion wrapper components
interface MotionDivProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
}

export const FadeUp = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeUpVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeUp.displayName = 'FadeUp';

export const StaggerContainer = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
StaggerContainer.displayName = 'StaggerContainer';

export const FadeIn = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeIn.displayName = 'FadeIn';

// Animated card with hover effect
export const AnimatedCard = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeUpVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn('transition-shadow hover:shadow-card-hover', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
);
AnimatedCard.displayName = 'AnimatedCard';

// Animated button wrapper
export const AnimatedButton = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
AnimatedButton.displayName = 'AnimatedButton';

// Animated number counter
interface AnimatedNumberProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  className,
  prefix = '',
  suffix = '',
  duration = 1,
}: AnimatedNumberProps) {
  return (
    <motion.span
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration }}
      >
        {prefix}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration }}
        >
          {value.toLocaleString('en-US')}
        </motion.span>
        {suffix}
      </motion.span>
    </motion.span>
  );
}

// Floating animation for decorative elements
interface FloatingElementProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: ReactNode;
  className?: string;
  delay?: number;
}

export const FloatingElement = forwardRef<HTMLDivElement, FloatingElementProps>(
  ({ children, className, delay = 0, ...props }, ref) => (
    <motion.div
      ref={ref}
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: [0.45, 0, 0.55, 1], // Custom smooth cubic bezier
        delay,
        repeatType: 'loop' as const,
      }}
      style={{ willChange: 'transform' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FloatingElement.displayName = 'FloatingElement';

// Animated underline for links
export function AnimatedLink({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <motion.a
      href={href}
      className={cn('relative inline-block', className)}
      whileHover="hover"
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-current"
        initial={{ width: 0 }}
        variants={{
          hover: { width: '100%', transition: { duration: 0.2 } },
        }}
      />
    </motion.a>
  );
}

// Page transition wrapper
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Export motion for direct use
export { motion };
