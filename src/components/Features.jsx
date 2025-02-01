import React from "react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      title: "Instant Access to Patient Records",
      description: "View medical history, prescriptions, and test results in seconds.",
      icon: "/assets/check-circle.svg",
    },
    {
      title: "Virtual Consultations Anywhere",
      description: "Connect with patients in remote areas via secure telehealth.",
      icon: "/assets/check-circle.svg",
    },
    {
      title: "Supplies in Real-Time",
      description: "Never run out of medicines or equipment.",
      icon: "/assets/check-circle.svg",
    },
    {
      title: "Cut Admin Work by 50%",
      description: "Automate appointments, billing, and NHIS claims.",
      icon: "/assets/check-circle.svg",
    },
    {
      title: "Smart AI Analytics",
      description: "Predict trends and prevent shortages with data-driven insights.",
      icon: "/assets/check-circle.svg",
    },
  ];

  return (
    <div className="bg-white py-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Key Features
        </motion.h2>

        {/* Subheading */}
        <motion.p
          className="text-gray-600 text-lg mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          BHMS+ is a cutting-edge platform that leverages the latest technology to improve
          healthcare delivery.
        </motion.p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Icon */}
               <div className="flex">
               <img
                src={feature.icon}
                alt={feature.title}
                className="w-8 h-8 mb-4"
              />
               </div>
              {/* Title */}
              <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
              {/* Description */}
              <p className="text-gray-600 text-sm text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
