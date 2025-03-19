import { useState } from "react";
import { motion } from "framer-motion";

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-row items-center justify-center w-full gap-2">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="animate-shimmer absolute inset-0 rounded-full bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 opacity-60 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <img
              src={item.image}
              alt={item.name}
              className="object-cover !m-0 !p-0 h-14 w-14 rounded-full border-2 border-white group-hover:scale-105 transition-transform duration-200"
            />
            {hoveredIndex === idx && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                className="absolute -top-16 -left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center"
              >
                <div className="px-4 py-2 bg-black rounded-md">
                  <p className="text-white font-bold text-sm">{item.name}</p>
                  <p className="text-white/80 text-xs">{item.designation}</p>
                </div>
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black"></div>
              </motion.div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};