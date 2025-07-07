import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiX, FiShield, FiCalendar, FiDatabase, FiShare2, FiClock, FiDollarSign, FiBarChart2, FiUser, FiSmartphone, FiGlobe } from "react-icons/fi";

const ComparisonTable = () => {
  const features = [
    {
      title: "Patient Login & Consultation Booking",
      icon: <FiCalendar className="text-blue-500" />,
      tonitel: { value: "Yes", icon: <FiCheck className="text-green-500" /> },
      traditional: { value: "No", icon: <FiX className="text-red-500" /> },
      description: "Secure patient portal with direct booking capabilities"
    },
    {
      title: "Data Security & Encryption",
      icon: <FiShield className="text-blue-500" />,
      tonitel: { value: "End-to-End Encryption", icon: <FiCheck className="text-green-500" /> },
      traditional: { value: "Basic Security", icon: <FiX className="text-red-500" /> },
      description: "Military-grade encryption protecting all patient data"
    },
    {
      title: "Inter-Hospital Data Sharing",
      icon: <FiShare2 className="text-blue-500" />,
      tonitel: { value: "Seamless Integration", icon: <FiCheck className="text-green-500" /> },
      traditional: { value: "Manual Processes", icon: <FiX className="text-red-500" /> },
      description: "Real-time data sharing between healthcare providers"
    },
    {
      title: "Mobile Accessibility",
      icon: <FiSmartphone className="text-blue-500" />,
      tonitel: { value: "Full Functionality", icon: <FiCheck className="text-green-500" /> },
      traditional: { value: "Limited Access", icon: <FiX className="text-red-500" /> },
      description: "Complete system access from any mobile device"
    },
    {
      title: "Real-time Analytics",
      icon: <FiBarChart2 className="text-blue-500" />,
      tonitel: { value: "Advanced Dashboards", icon: <FiCheck className="text-green-500" /> },
      traditional: { value: "Basic Reporting", icon: <FiX className="text-red-500" /> },
      description: "Instant insights into patient and practice metrics"
    },
    {
      title: "Multi-language Support",
      icon: <FiGlobe className="text-blue-500" />,
      tonitel: { value: "15+ Languages", icon: <FiCheck className="text-green-500" /> },
      traditional: { value: "English Only", icon: <FiX className="text-red-500" /> },
      description: "Global accessibility for diverse patient populations"
    },
    {
      title: "Automated Billing",
      icon: <FiDollarSign className="text-blue-500" />,
      tonitel: { value: "Integrated System", icon: <FiCheck className="text-green-500" /> },
      traditional: { value: "Manual Invoicing", icon: <FiX className="text-red-500" /> },
      description: "Streamlined billing with insurance integration"
    },
    {
      title: "Patient History Tracking",
      icon: <FiDatabase className="text-blue-500" />,
      tonitel: { value: "Lifetime Records", icon: <FiCheck className="text-green-500" /> },
      traditional: { value: "Limited History", icon: <FiX className="text-red-500" /> },
      description: "Comprehensive longitudinal patient records"
    },
    {
      title: "24/7 Support",
      icon: <FiClock className="text-blue-500" />,
      tonitel: { value: "Dedicated Team", icon: <FiCheck className="text-green-500" /> },
      traditional: { value: "Business Hours", icon: <FiX className="text-red-500" /> },
      description: "Round-the-clock technical and medical support"
    },
    {
      title: "Telemedicine Integration",
      icon: <FiUser className="text-blue-500" />,
      tonitel: { value: "Built-in Platform", icon: <FiCheck className="text-green-500" /> },
      traditional: { value: "Third-party Needed", icon: <FiX className="text-red-500" /> },
      description: "Complete virtual care solution within the system"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-500">
              Tonitel
            </span> vs Traditional Systems
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our modern healthcare platform outperforms legacy systems in every aspect
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
                <tr>
                  <th className="py-6 px-6 text-left font-semibold text-sm uppercase w-2/5">
                    <div className="flex items-center">
                      <FiDatabase className="mr-3" />
                      Key Features
                    </div>
                  </th>
                  <th className="py-6 px-6 text-center font-semibold text-sm uppercase w-1/5">
                    <div className="flex items-center justify-center">
                      <FiCheck className="mr-2" />
                      Tonitel
                    </div>
                  </th>
                  <th className="py-6 px-6 text-center font-semibold text-sm uppercase w-1/5">
                    <div className="flex items-center justify-center">
                      <FiX className="mr-2" />
                      Traditional
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {features.map((feature, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.01 }}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                          {feature.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{feature.title}</div>
                          <div className="text-gray-500 text-sm mt-1">{feature.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex items-center justify-center">
                        {feature.tonitel.icon}
                        <span className="ml-2 font-medium">{feature.tonitel.value}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex items-center justify-center">
                        {feature.traditional.icon}
                        <span className="ml-2 font-medium">{feature.traditional.value}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-medium">10+</span> additional features available
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
                Request Full Feature List
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;