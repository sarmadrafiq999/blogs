"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

export default function FloatingPlusButton({ open, setOpen, position = "br" }) {
  // position: "br" (bottom-right), "bc" bottom-center, "tr" top-right
  const posClass =
    position === "bc"
      ? "bottom-8 left-1/2 transform -translate-x-1/2"
      : position === "tr"
      ? "top-6 right-6"
      : "bottom-8 right-6";

  return (
    <div className={`fixed z-60 ${posClass} pointer-events-auto`}>
      <AnimatePresence>
        <motion.button
          key={open ? "open" : "closed"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((s) => !s)}
          aria-label={open ? "Close editor toolbars" : "Open editor toolbars"}
          className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full shadow-xl
                     bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300/40
                     text-white border border-amber-700"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                className="flex items-center justify-center"
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="plus"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                className="flex items-center justify-center"
              >
                <Plus size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
