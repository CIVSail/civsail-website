'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';

/**
 * ScrollReveal - Reusable wrapper for scroll-triggered animations
 * 
 * Uses Intersection Observer to trigger Framer Motion animations
 * when elements enter the viewport
 */

type ScrollRevealProps = {
  children: ReactNode;
  variant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight';
  delay?: number;
  duration?: number;
  threshold?: number; // % of element visible before triggering
  className?: string;
};

// Animation variants for different reveal styles
const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth deceleration
      },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },
};

export function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration,
  threshold = 0.2,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      controls.start('visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          controls.start('visible');
          setHasAnimated(true); // Only animate once
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls, hasAnimated, threshold]);

  // Get the variant with optional duration override
  const animationVariant = variants[variant];
  const customVariant = duration
    ? {
        ...animationVariant,
        visible: {
          ...animationVariant.visible,
          transition: {
            ...animationVariant.visible.transition,
            duration,
          },
        },
      }
    : animationVariant;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={customVariant}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}