import React from 'react';
import { motion } from 'framer-motion';

const ContactFrames: React.FC = () => {
  return (
    <section className="py-8 sm:py-10 md:py-12 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Frame - For Dealers */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-dark-secondary/20 backdrop-blur-md border border-dark-border/30 rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-lg sm:text-xl text-accent-primary font-medium mb-2 sm:mb-3">For Dealers</h3>
            <p className="text-text-secondary text-sm sm:text-base mb-4 sm:mb-6">
              If you want to connect to our automated customer service system, request a callback.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-gradient-to-r from-accent-primary to-accent-primary/80 border border-accent-secondary px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-colors font-medium tracking-wider uppercase text-xs sm:text-sm text-white hover:brightness-110"
            >
              Request Callback
            </motion.button>
          </motion.div>

          {/* Right Frame - For Clients */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-dark-secondary/20 backdrop-blur-md border border-dark-border/30 rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-lg sm:text-xl text-accent-secondary font-medium mb-2 sm:mb-3">For Clients</h3>
            <p className="text-text-secondary text-sm sm:text-base mb-4 sm:mb-6">
              If you want to become a referral or have any additional questions, please contact us.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-gradient-to-r from-accent-secondary to-accent-secondary/80 border border-accent-primary px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-colors font-medium tracking-wider uppercase text-xs sm:text-sm text-white hover:brightness-110"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactFrames;
