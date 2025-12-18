import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ timeout = 2500 }) => {
  const [isVisible, setIsVisible] = useState(true);

  const containerVariants = {
    initial: { opacity: 1 },
    exit: { 
      opacity: 0,
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  const logoVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.1
      }
    }
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  const textVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading-screen"
          variants={containerVariants}
          initial="initial"
          exit="exit"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <motion.div
            variants={logoVariants}
            initial="initial"
            animate="animate"
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              marginBottom: '2rem',
            }}
          >
            <motion.div
              variants={spinnerVariants}
              animate="animate"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: '2px solid #e0e0e0',
                borderTopColor: '#1890ff',
                borderRadius: '50%',
              }}
            />
            
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '24px',
              color: '#1890ff',
              fontWeight: 'bold',
            }}>
              L
            </div>
          </motion.div>

          <motion.div
            variants={textVariants}
            animate="animate"
            style={{
              fontSize: '14px',
              color: '#666',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Loading
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;