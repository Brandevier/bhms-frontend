import React from "react";
import { motion } from "framer-motion";
import { FiDownload, FiSmartphone, FiBell, FiArrowRight } from "react-icons/fi";

const AppComingSoon = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left side - Content */}
            <div className="p-8 sm:p-10 lg:p-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600 mb-4">
                  <FiBell className="mr-2" />
                  Coming Soon
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  <span className="text-blue-600">Tonitel Patient App</span> is on its way!
                </h2>
                
                <p className="text-lg text-gray-600 mb-6">
                  Our Android application will revolutionize how patients access healthcare services. 
                  Get notified when we launch and be among the first to experience seamless medical care.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">
                        <FiDownload className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-900">Early Access</p>
                      <p className="text-base text-gray-600">
                        Scan the QR code to join our waitlist for exclusive early access
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">
                        <FiSmartphone className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-900">App Features</p>
                      <p className="text-base text-gray-600">
                        Book appointments, view medical records, chat with doctors, and more
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">
                    Notify Me on Launch
                    <FiArrowRight className="ml-2" />
                  </button>
                  <button className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors">
                    Learn More
                  </button>
                </div>
              </motion.div>
            </div>
            
            {/* Right side - QR Code & Phone Mockup */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
              >
                <div className="mb-4 text-gray-800 font-medium">
                  Scan for early access
                </div>
                
                {/* QR Code Placeholder - Replace with your actual QR code */}
                <div className="flex justify-center mb-4">
                  <div className="h-48 w-48 border-4 border-blue-100 rounded-lg flex items-center justify-center bg-white p-2">
                    <div className="text-center text-gray-400">
                      <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className={`h-6 w-6 ${i % 2 === 0 ? 'bg-gray-800' : 'bg-white'}`}></div>
                        ))}
                      </div>
                      <p className="mt-2 text-xs">TONITEL-PATIENT-APP</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center text-white bg-blue-600 rounded-lg py-2 px-4">
                  <FiSmartphone className="mr-2" />
                  <span className="text-sm font-medium">Android Coming Soon</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-8 text-center text-blue-100"
              >
                <p className="text-sm">iOS version will follow shortly after</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppComingSoon;