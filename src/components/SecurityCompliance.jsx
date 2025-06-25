import React from "react";
import { motion } from "framer-motion";
import { FiShield, FiLock, FiGlobe, FiCheckCircle } from "react-icons/fi";

const SecurityCompliance = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Your Data is <span className="text-blue-600">Protected</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Tonitel meets the highest security standards to ensure patient confidentiality and regulatory compliance.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* HIPAA Compliance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                <FiShield className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">HIPAA Compliant</h3>
            <p className="text-gray-600 mb-4">
              Fully compliant with U.S. healthcare data protection laws.
            </p>
            <div className="inline-flex items-center text-sm font-medium text-blue-600">
              <FiCheckCircle className="mr-1" /> Certified
            </div>
          </motion.div>

          {/* GDPR Compliance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-green-50 text-green-600">
                <FiGlobe className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">GDPR Ready</h3>
            <p className="text-gray-600 mb-4">
              Ensures EU data privacy regulations are strictly followed.
            </p>
            <div className="inline-flex items-center text-sm font-medium text-green-600">
              <FiCheckCircle className="mr-1" /> Verified
            </div>
          </motion.div>

          {/* End-to-End Encryption */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                <FiLock className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Military-Grade Encryption</h3>
            <p className="text-gray-600 mb-4">
              AES-256 encryption secures all patient and hospital data.
            </p>
            <div className="inline-flex items-center text-sm font-medium text-purple-600">
              <FiCheckCircle className="mr-1" /> Unbreakable
            </div>
          </motion.div>

          {/* Audit Logs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-orange-50 text-orange-600">
                <FiCheckCircle className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Monitoring</h3>
            <p className="text-gray-600 mb-4">
              Full audit logs track every access to sensitive records.
            </p>
            <div className="inline-flex items-center text-sm font-medium text-orange-600">
              <FiCheckCircle className="mr-1" /> Tracked
            </div>
          </motion.div>
        </div>

        {/* Additional Trust Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 mb-4">Trusted by leading hospitals worldwide</p>
          <div className="flex flex-wrap justify-center gap-6">
            {["Hospital1", "Clinic2", "MedicalGroup3", "HealthSystem4"].map((item, index) => (
              <div key={index} className="bg-white px-6 py-3 rounded-lg shadow-xs border border-gray-200 opacity-80 hover:opacity-100 transition-opacity">
                <span className="font-medium text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SecurityCompliance;