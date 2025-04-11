import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center">
        <img src="/assets/logo.svg" alt="Logo" className="h-8" />
      </div>

      {/* Menu Icon for Mobile */}
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

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-16 right-0 bg-white shadow-md w-full p-4 flex flex-col space-y-2 md:hidden"
          >
            <button
              className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition duration-300 text-left"
              onClick={() => window.open("https://wa.me/+233509279792", "_blank")}
            >
              Contact Us
            </button>
            <button
              className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition duration-300 text-left"
              onClick={() => {
                navigate('/hms/login');
                setIsMenuOpen(false);
              }}
            >
              Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Menu */}
      <div className="hidden md:flex md:items-center md:space-x-4">
        <button 
          className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition duration-300"
          onClick={() => window.open("https://wa.me/+233509279792", "_blank")}
        >
          Contact Us
        </button>
        <button 
          className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition duration-300"
          onClick={() => navigate('/hms/login')}
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Header;