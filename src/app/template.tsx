import { ReactNode } from 'react';

// Template wrapper - View Transitions API handles page transitions via CSS
// This file is kept minimal to avoid conflicting animations
export default function Template({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
