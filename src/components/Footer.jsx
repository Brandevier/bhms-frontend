import React from "react";


const Footer = () => {
  return (
    <footer className="bg-white text-gray-500 text-sm py-8 px-6 mt-10 w-full">
      {/* Main Container */}
      <div className="w-full md:w-[90%] mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Left Section */}
          <div className="mb-6 md:mb-0">
            <img src="/assets/logo_2.png" alt="tonitel Logo" className="h-8 mb-2" />
            <p className="leading-relaxed max-w-xs">
            Tonitel is a strategic partner helping healthcare providers cut costs, improve patient outcomes, and future-proof operations.
            </p>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-start md:items-end">
            <p className="text-gray-600 font-medium mb-2">Connect With Us</p>
            <div className="flex space-x-3">
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
                <img src="/assets/x.svg" alt="Twitter" className="h-5" />
              </a>
              <a href="https://www.linkedin.com/company/tonitel/" target="_blank" rel="noopener noreferrer">
                <img src="/assets/linkdin.svg" alt="LinkedIn" className="h-5" />
              </a>
            
              {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="/assets/facebook.svg" alt="Facebook" className="h-5" />
              </a> */}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <p>© 2024 Tonitel Technology Ltd. All rights reserved.</p>
          <div className="flex space-x-6 mt-2 md:mt-0">
            <a href="/contact" className="hover:text-black">Contact Us</a>
            <a href="/privacy-policy" className="hover:text-black">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;