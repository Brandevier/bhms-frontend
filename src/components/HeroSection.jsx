import React from 'react';
import { motion } from 'framer-motion';
import WaitListDialog from './WaitListDialog';

const HeroSection = () => {
  // Variants for slide-in animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Stagger the animations of children
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 }, // Slide in from the left
    visible: { opacity: 1, x: 0, transition: { type: 'tween', ease: 'easeOut', duration: 0.6 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 }, // Slide in from the bottom
    visible: { opacity: 1, y: 0, transition: { type: 'tween', ease: 'easeOut', duration: 0.8 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } }, // Hover effect
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 }, // Start smaller
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120, delay: 0.5 } }, // Spring effect with delay
  };

  return (
    <div className="bg-white py-16 px-4 lg:px-8">
      <motion.div
        className="container mx-auto text-center max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Tagline */}
        <motion.div
          className="mb-4"
          variants={itemVariants}
        >
          <span className="text-sm text-green-600 font-medium px-4 py-1 rounded-full bg-green-100 shadow-md">
            Go Paperless. Deliver Better Care.
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-3xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight"
          style={{ fontWeight: 'bold' }} // Explicitly set font weight as a fallback
          variants={itemVariants}
        >
          Transform{' '}
          <span className="text-[#19417D]">Healthcare</span> Delivery with BrandeviaHMS+
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-gray-600 text-lg lg:text-xl mb-8"
          variants={itemVariants}
        >
          bHMS+ is a modern, cloud-based healthcare platform designed to simplify hospital operations
          and improve patient outcomes across.
        </motion.p>

        {/* Call-to-Action Button */}
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
        >
          <WaitListDialog className={"py-5"} />
        </motion.div>
      </motion.div>

      {/* Mockup Image */}
      <motion.div
        className="mt-12"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          src="/assets/Dashboard.png"
          alt="Dashboard Mockup"
          className="mx-auto rounded-lg shadow-lg w-[90%]"
        />
      </motion.div>
    </div>
  );
};

export default HeroSection;