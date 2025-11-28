"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[#0b0b0f]/95 flex items-center justify-center z-50">
      {["0", "0.2", "0.4"].map((delay, i) => (
        <motion.div
          key={i}
          className="w-6 h-6 rounded-full mx-2
            bg-amber-400 shadow-[0_0_8px_rgba(255,191,0,0.5)]"
          animate={{
            y: [0, -16, 0],
            boxShadow: [
              "0 0 4px rgba(255,191,0,0.3)",
              "0 0 12px rgba(255,191,0,0.6)",
              "0 0 4px rgba(255,191,0,0.3)",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            ease: "easeInOut",
            delay: parseFloat(delay),
          }}
        />
      ))}
    </div>
  );
}
