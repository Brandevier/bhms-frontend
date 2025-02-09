import React from "react";
import { motion } from "framer-motion";

const Features = () => {
  
  const features = [
    {
      title: "Insurance Claims",
      description: "Automates claim processing, ensures compliance, and speeds up reimbursements.",
      icon: "/assets/check-circle.svg",
    },
    {
      title: "Instant Access to Patient Records",
      description: "View medical history, prescriptions, and test results in seconds.",
      icon: "/assets/check-circle.svg",
    },
    {
      title: "Custom Departments Creation",
      description: "Admins can create departments and assign staff as needed.",
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


    // SECOND OPTIONS
    {
      title: "Create Electronic Health Records",
      description: "Instant access to medical history, prescriptions, and test results.",
      icon: "/assets/check-circle.svg",
    },
    {
      title: "Automated Workflow Optimization",
      description: "Reduces admin workload, enabling staff to focus on patient care.",
      icon: "/assets/check-circle.svg",
    },
    {
      title: "Secure Cloud Location",
      description: "Ensures secure, remote access to patient data for better collaboration.",
      icon: "/assets/check-circle.svg",
    },
    {
      title: "Telehealth Integration",
      description: "Supports online appointments, virtual consultations, and remote monitoring.",
      icon: "/assets/check-circle.svg",
    },

    {
      title: "Inventory Management",
      description: "Tracks supplies in real time, streamlines procurement, and prevents shortages.",
      icon: "/assets/check-circle.svg",
    },
    {
      title: "E-Pharmacy",
      description: "Facilitates electronic prescriptions and efficient medication management.",
      icon: "/assets/check-circle.svg",
    },
  ];

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger the animations of children
      },
    },
  };

  // Animation variants for each feature card
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120 } },
  };

  return (
    <div className="bg-white py-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }} // Trigger animation only once
        >
          Key Features
        </motion.h2>

        {/* Subheading */}
        <motion.p
          className="text-gray-600 text-lg mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          bhms+ is a cutting-edge platform that leverages the latest technology to improve
          healthcare delivery.
        </motion.p>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the container is in view
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col md:items-start items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
              variants={cardVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} // Add hover effect
            >
              {/* Icon */}
              <div className="flex">
                <motion.img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-8 h-8 mb-4"
                  whileHover={{ rotate: 15, transition: { duration: 0.3 } }} // Add icon hover animation
                />
              </div>
              {/* Title */}
              <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
              {/* Description */}
              <p className="text-gray-600 text-sm text-center">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Features;