import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '#' },
    { name: 'About', path: '#' },
    { name: 'contact', path: '#' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-50"
    >
      {/* Logo */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex items-center cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src="/assets/logo_2.png" alt="Logo" className="h-8" />
      </motion.div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex md:items-center md:space-x-6">
        {navLinks.map((link, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05, color: '#3b82f6' }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-700 px-3 py-2 font-medium transition-colors"
            onClick={() => navigate(link.path)}
          >
            {link.name}
          </motion.button>
        ))}
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden md:flex md:items-center md:space-x-4">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-700 px-4 py-2 rounded transition"
          onClick={() => window.open("https://wa.me/+233509279792", "_blank")}
        >
          Contact Us
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#3b82f6', color: 'white' }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-100 text-blue-600 px-4 py-2 rounded font-medium transition"
          onClick={() => navigate('/hms/login')}
        >
          Login
        </motion.button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
          className="text-gray-700 focus:outline-none p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg mx-4 rounded-md overflow-hidden"
          >
            <div className="flex flex-col">
              {navLinks.map((link, index) => (
                <motion.button
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-gray-700 hover:bg-gray-100 px-6 py-3 text-left border-b border-gray-100 transition"
                  onClick={() => {
                    navigate(link.path);
                    setIsMenuOpen(false);
                  }}
                >
                  {link.name}
                </motion.button>
              ))}
              <div className="p-4 flex flex-col space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-100 text-blue-600 px-4 py-2 rounded font-medium transition"
                  onClick={() => {
                    navigate('/hms/login');
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-gray-700 px-4 py-2 rounded border border-gray-300 transition"
                  onClick={() => {
                    window.open("https://wa.me/+233509279792", "_blank");
                    setIsMenuOpen(false);
                  }}
                >
                  Contact Us
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Header;