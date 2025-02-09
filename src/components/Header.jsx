import React, { useState } from 'react';
import WaitListDialog from './WaitListDialog';
import { AnimatePresence, motion } from 'framer-motion'; // Import framer-motion

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center">
        <img src="/assets/logo.svg" alt="Logo" className="h-8" />
      </div>

      {/* Menu Icon for Small Devices */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Animated Menu Items */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} // Initial state (before animation)
            animate={{ opacity: 1, y: 0 }} // Final state (during animation)
            exit={{ opacity: 0, y: -10 }} // Exit state (when menu closes)
            transition={{ duration: 0.3, ease: 'easeInOut' }} // Animation settings
            className="absolute md:static top-16 right-0 bg-white shadow-md md:shadow-none w-full md:w-auto p-4 md:p-0 flex flex-col md:flex-row md:space-x-4 md:items-center"
          >
            <button
              className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition duration-300 w-full md:w-auto text-left md:text-center"
              onClick={() => window.open("https://wa.me/+233531130159", "_blank")}
            >
              Contact Us
            </button>

            <WaitListDialog />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static Menu Items for Large Devices */}
      <div className="hidden md:flex md:items-center md:space-x-4">
        <button className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition duration-300 w-full md:w-auto text-left md:text-center">
          Contact Us
        </button>
        <WaitListDialog />
      </div>
    </nav>
  );
};

export default Header;