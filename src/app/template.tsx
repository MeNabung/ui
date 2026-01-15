'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

// Page transition wrapper - provides smooth fade between pages
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut'
      }}
      style={{ willChange: 'opacity' }}
    >
      {children}
    </motion.div>
  );
}
