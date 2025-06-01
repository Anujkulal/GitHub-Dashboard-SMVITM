import React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { motion } from 'framer-motion';

const imageVariants = cva(
  "object-cover rounded-full transition-all duration-300 ease-in-out",
  {
    variants: {
      size: {
        small: "w-10 h-10",
        medium: "w-25 h-25",
        large: "w-30 h-30",
      },
    },
    defaultVariants: {
      size: "medium",
      rounded: false,
    },
  }
);

const Image = ({ className, size, ...props }) => {
  return (
    <motion.img
      className={cn(imageVariants({ size }), className)}
      {...props}
    //   whileHover={{ scale: 1.05 }}
    />
  );
};

export default Image;
