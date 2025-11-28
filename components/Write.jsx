"use client";

import React from "react";
import { motion } from "framer-motion";
import Tittle from "./Tittle";
import StartReadingButton from "./StartReadingButton";

const Write = () => {
  return (
    <div className="h-screen bg-[#0b0b0d] bg-center relative flex items-center justify-center px-4 overflow-hidden">
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl z-0 animate-fadeIn" />

      {/* Centered Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-gray-100 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 120 }}
        >
          <Tittle text1="Explore" text2="Top Blogs" />
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          Best Blogs in the World
        </motion.h1>

        <motion.h2
          className="text-2xl sm:text-3xl font-medium drop-shadow-md text-gray-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Enjoy the Interesting Stories and Arts
        </motion.h2>

        {/* Stylish Animated Line */}
        <motion.div
          className="w-60 h-[3px] bg-amber-500 animate-pulse rounded-full shadow-lg mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Animated Start Button */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 120 }}
        >
          <StartReadingButton />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Write;
