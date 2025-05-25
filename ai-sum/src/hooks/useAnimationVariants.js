import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const useAnimationVariants = () => {
  const containerVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        scale: 0.9,
        transition: {
          ease: "easeIn",
          duration: 0.3,
        },
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          ease: "easeOut",
          duration: 0.5,
          staggerChildren: 0.15,
          delayChildren: 0.1,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: 20,
        transition: {
          ease: "easeIn",
          duration: 0.3,
        },
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          ease: "easeOut",
          duration: 0.5,
        },
      },
    }),
    []
  );

  const fadeInVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        transition: {
          ease: "easeIn",
          duration: 0.3,
        },
      },
      visible: {
        opacity: 1,
        transition: {
          ease: "easeOut",
          duration: 0.6,
        },
      },
    }),
    []
  );

  const slideUpVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: "100%",
        transition: {
          ease: "easeIn",
          duration: 0.3,
        },
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          ease: "easeOut",
          duration: 0.5,
        },
      },
    }),
    []
  );

  const slideDownVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: "-100%",
        transition: {
          ease: "easeIn",
          duration: 0.3,
        },
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          ease: "easeOut",
          duration: 0.5,
        },
      },
    }),
    []
  );

  return {
    containerVariants,
    itemVariants,
    fadeInVariants,
    slideUpVariants,
    slideDownVariants,
  };
};
