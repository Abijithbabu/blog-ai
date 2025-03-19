"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white p-8 shadow-md transition-shadow hover:shadow-xl",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 opacity-0"
        whileHover={{ opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}; 