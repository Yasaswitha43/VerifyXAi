import React from 'react';
import { AnimatedSecurityBackground } from './AnimatedSecurityBackground';

interface SecurityBackground3DProps {
  isLanding?: boolean;
}

export const SecurityBackground3D: React.FC<SecurityBackground3DProps> = () => {
  // Reusable unified background throughout the application
  return <AnimatedSecurityBackground />;
};

export { AnimatedSecurityBackground };
