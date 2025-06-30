import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import BhmsButton from "../heroComponents/BhmsButton";


const EarlyAdopterBanner = () => {
  const { ref, inView } = useInView({ threshold: 0.2 });
  const animationControls = useAnimation();

  React.useEffect(() => {
    if (inView) {
      animationControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8 },
      });
    }
  }, [inView, animationControls]);

  return (
    <div className="relative h-auto md:h-screen flex items-center justify-center overflow-hidden bg-gray-100 py-12 md:py-0">
      {/* Container with border radius */}
      <div
        ref={ref}
        className="relative w-full md:w-[90%] mx-auto bg-blue-900 text-white h-auto md:h-[600px] rounded-md overflow-hidden shadow-lg flex items-center justify-center px-6 lg:px-20 py-8 md:py-0"
      >
        {/* Main Content */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 items-center w-full gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={animationControls}
        >
          {/* Left Section */}
          <div className="space-y-6 text-center lg:text-left">
            <motion.button
              className="px-4 py-2 bg-blue-800 text-sm font-semibold rounded-full shadow-md"
              whileHover={{ scale: 1.1 }}
            >
              Join Us
            </motion.button>
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
              Special Discounts for Early Adopters
            </h1>
            <p className="text-lg text-blue-200">
              Join over 100+ Hospitals waiting to transition onto Tonitel Digital
              platform
            </p>
            <BhmsButton className="px-6 py-3  text-blue-900 font-semibold rounded-md shadow-md" size="sm">
              Join Waitlist
            </BhmsButton>
          </div>

          {/* Right Section */}
          <div className="relative">
            {/* Main Image */}
            <img
              src="/assets/main.png"
              alt="Main Banner"
              className="rounded-lg shadow-lg w-full"
            />
            {/* Overlay Cards */}
            <motion.div
              className="absolute top-4 left-4 shadow-lg rounded-lg p-4 w-40 md:w-52 flex items-center gap-4 "
              initial={{ opacity: 0, y: -30 }}
              animate={animationControls}
              transition={{ delay: 0.3 }}
            >
              <img
                src="/assets/Frame1.svg"
                alt="Free Training"
                className="w-8 h-8"
              />
            </motion.div>
            <motion.div
              className="absolute bottom-6 left-4 shadow-lg rounded-lg p-4 w-40 md:w-52 flex items-center gap-4 "
              initial={{ opacity: 0, x: -50 }}
              animate={animationControls}
              transition={{ delay: 0.6 }}
            >
              <img
                src="/assets/Frame3.svg"
                alt="Affordable Pricing"
                className="w-8 h-8"
              />
            </motion.div>
            <motion.div
              className="absolute top-4 right-4 shadow-lg rounded-lg p-4 w-40 md:w-52 flex items-center gap-4 "
              initial={{ opacity: 0, x: 50 }}
              animate={animationControls}
              transition={{ delay: 0.9 }}
            >
              <img
                src="/assets/Frame3.svg"
                alt="24/7 Local Support"
                className="w-8 h-8"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EarlyAdopterBanner;