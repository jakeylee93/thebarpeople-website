"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

interface LogoItem {
  name: string;
  logo?: string;
}

interface LogoStripProps {
  logos: LogoItem[];
  speed?: number;
}

export function LogoStrip({ logos, speed = 30 }: LogoStripProps) {
  const duplicated = [...logos, ...logos, ...logos];

  return (
    <div className="overflow-hidden mask-gradient-x">
      <motion.div
        className="flex gap-12 items-center"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ width: "max-content" }}
      >
        {duplicated.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-center px-6 py-2 whitespace-nowrap"
          >
            <span className="text-white/30 text-lg font-semibold tracking-widest uppercase hover:text-white/60 transition-colors duration-300 cursor-default">
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
