// utils/motion.js
import { motion } from 'framer-motion';

export const staggerContainer = (staggerChildren, delayChildren) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerChildren || 0.1,
      delayChildren: delayChildren || 0
    }
  }
});

export const fadeIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
    y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
    opacity: 0
  },
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: type || 'tween',
      delay: delay || 0,
      duration: duration || 1,
      ease: 'easeOut'
    }
  }
});