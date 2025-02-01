import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0">
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

      {/* Menu Items */}
      <div
        className={`md:flex md:items-center md:space-x-4 ${
          isMenuOpen ? 'block' : 'hidden'
        } absolute md:static top-16 right-0 bg-white shadow-md md:shadow-none w-full md:w-auto p-4 md:p-0`}
      >
        <button className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition duration-300 w-full md:w-auto text-left md:text-center">
          Contact Us
        </button>
        <button className="block bg-[#19417D] text-white hover:bg-blue-700 px-4 py-2 rounded transition duration-300 w-full md:w-auto text-left md:text-center mt-2 md:mt-0">
          Join Waitlist
        </button>
      </div>
    </nav>
  );
};

export default Header;