import React from "react";

/**
 * Reusable animation keyframes and utility classes
 * Used across the application for consistent animation patterns
 */

export const ANIMATION_KEYFRAMES = `
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-down {
    animation: fadeInDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-fade-in-scale {
    animation: fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  .animate-slide-up {
    animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-slide-down {
    animation: slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

/**
 * Animation delay utilities for staggered animations
 */
export const getAnimationDelay = (index: number, delayIncrement: number = 0.05) => {
  return `${0.2 + index * delayIncrement}s`;
};

/**
 * Component wrapper for animation styles
 * Use this to inject animation keyframes into your pages
 */
export const AnimationStyles = () => (
  <style>{ANIMATION_KEYFRAMES}</style>
);

/**
 * Helper function to create staggered animation classes
 * @param baseClass - Base animation class (e.g., 'animate-fade-in-scale')
 * @param index - Index for calculating delay
 * @param delayIncrement - Milliseconds between each stagger
 * @returns CSS class string with animation and delay
 */
export const createStaggerAnimation = (
  baseClass: string,
  index: number,
  delayIncrement: number = 0.05,
): string => {
  const delay = getAnimationDelay(index, delayIncrement);
  return `${baseClass}`;
};
