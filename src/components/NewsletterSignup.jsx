import React from "react";
import { motion } from "framer-motion";

const NewsletterSignup = () => {
  return (
    <motion.section
      className="bg-gray-100 py-6 px-6 rounded-lg w-full md:w-[90%] mx-auto my-20"
      initial={{ opacity: 0, y: 50 }} // Initial state (hidden)
      whileInView={{ opacity: 1, y: 0 }} // Animate when in view
      transition={{ duration: 0.6 }} // Animation duration
      viewport={{ once: true, amount: 0.5 }} // Trigger once, when 50% of the element is visible
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <motion.div
          className="mb-4 md:mb-0"
          initial={{ opacity: 0, x: -20 }} // Initial state (hidden)
          whileInView={{ opacity: 1, x: 0 }} // Animate when in view
          transition={{ duration: 0.6, delay: 0.2 }} // Slight delay for staggered effect
          viewport={{ once: true, amount: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-800">Join Our Newsletter</h3>
          <p className="text-gray-500 text-sm">We’ll send you a nice letter once per week. No spam.</p>
        </motion.div>

        {/* Right Section - Email Input */}
        <motion.form
          className="flex items-center w-full md:w-auto"
          initial={{ opacity: 0, x: 20 }} // Initial state (hidden)
          whileInView={{ opacity: 1, x: 0 }} // Animate when in view
          transition={{ duration: 0.6, delay: 0.4 }} // Slight delay for staggered effect
          viewport={{ once: true, amount: 0.5 }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
          />
          <motion.button
            type="submit"
            className="bg-[#19417D] text-white px-4 py-2 ml-2 rounded-md text-sm hover:bg-blue-700 transition"
            whileHover={{ scale: 1.05 }} // Add hover effect
            whileTap={{ scale: 0.95 }} // Add tap effect
          >
            Subscribe
          </motion.button>
        </motion.form>
      </div>
    </motion.section>
  );
};

export default NewsletterSignup;