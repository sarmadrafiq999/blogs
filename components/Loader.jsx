// components/Loader.jsx
"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-64 w-full">
      <motion.div
        className="w-6 h-6 bg-gray-600  rounded-full mx-1"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
      />
      <motion.div
        className="w-6 h-6 bg-gray-600  rounded-full mx-1"
        animate={{ y: [0, -15, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.6,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-6 h-6 bg-gray-600 rounded-full mx-1"
        animate={{ y: [0, -15, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.6,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
    </div>
  );
}
