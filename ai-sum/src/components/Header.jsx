import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const Header = ({
  title = "AI Summarizer",
  className = "",
  variant = "dark",
}) => {
  // Define class names based on variant
  const variantClasses = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-700 text-white",
    success: "bg-green-600 text-white",
    dark: "bg-gray-900 text-white",
  };

  const combinedClasses = `py-6 px-4 ${
    variantClasses[variant] || variantClasses.dark
  } ${className}`;

  // Letter animation
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 2,
      },
    }),
  };

  // Header animation
  const headerAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 3,
      },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4 } },
  };

  return (
    <motion.header
      className={combinedClasses}
      role="banner"
      aria-label="Site header"
      initial={headerAnimation.initial}
      animate={headerAnimation.animate}
      exit={headerAnimation.exit}
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          className="inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {title.split("").map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              custom={index}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-5xl font-bold inline-block font-inter"
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                display: char === " " ? "inline" : "inline-block",
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
        <motion.div
          className="h-1 bg-white w-0 mx-auto mt-2"
          animate={{ width: "60px" }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
      </div>
    </motion.header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "success", "dark"]),
};

export default React.memo(Header);
