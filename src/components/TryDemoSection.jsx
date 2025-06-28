import React from "react";
import { motion } from "framer-motion";

const TryDemoSection = () => {
  return (
    <section className="w-full bg-gradient-to-br from-[#E6FFF7] to-[#f0fdf4] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h2 className="text-4xl font-bold text-[#19417D] mb-4">
              Experience Tonitel in Action{" "}
              <span className="text-[#00DFA2]">🚀</span>
            </h2>
            <p className="text-gray-700 text-lg mb-8 max-w-lg mx-auto md:mx-0">
              See how our healthcare platform transforms patient management in just 2 minutes:
            </p>
            <ul className="space-y-3 mb-8 text-left max-w-md mx-auto md:mx-0">
              {[
                "No installation required",
                "Real demo data provided",
                "Guided tour of key features",
                "No commitment - just valuable insights"
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <span className="text-[#00DFA2] mr-2 mt-1">✓</span>
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#19417D] hover:bg-[#143265] text-white text-lg font-semibold py-3 px-4 rounded-full transition duration-300 shadow-lg flex-1"
              >
                Request Live Demo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-[#00DFA2] text-[#19417D] hover:bg-[#00DFA2]/10 text-lg font-semibold py-3 px-8 rounded-full transition duration-300 flex-1"
              >
                Self-Guided Tour
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column - Demo Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white p-1 rounded-xl shadow-xl border border-gray-100">
              {/* Replace with your actual dashboard image */}
              <img 
                src="/assets/dashboard.png" 
                alt="Tonitel dashboard preview" 
                className="rounded-lg w-full"
              />
              <div className="absolute -bottom-4 -right-4">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="bg-[#00DFA2] text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Demo
                </motion.div>
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              {[
                { icon: "👩⚕️", label: "Doctor View" },
                { icon: "🏥", label: "Admin View" },
                { icon: "👨💻", label: "Patient View" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -3 }}
                  className="text-center cursor-pointer"
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TryDemoSection;