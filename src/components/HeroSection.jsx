import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <div className="bg-white py-16 px-4 lg:px-8">
      <div className="container mx-auto text-center max-w-5xl">
        {/* Tagline */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm text-green-600 font-medium px-4 py-1 rounded-full bg-green-100">
            Go Paperless. Deliver Better Care.
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-3xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Transform <span className="text-[#19417D]">Healthcare</span> Delivery with BrandeviaHMS+
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-gray-600 text-lg lg:text-xl mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          bHMS+ is a modern, cloud-based healthcare platform designed to simplify hospital operations
          and improve patient outcomes across Ghana, Nigeria, and the entire Africa.
        </motion.p>

        {/* Call-to-Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <button className="bg-[#19417D] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Join Waitlist
          </button>
        </motion.div>
      </div>

      {/* Mockup Image */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
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
