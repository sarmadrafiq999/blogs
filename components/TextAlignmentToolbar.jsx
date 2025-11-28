"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
} from "lucide-react";

export default function TextAlignmentToolbar({ editorRef }) {
  const exec = (command) => {
    if (!editorRef?.current) return;
    document.execCommand(command, false, null);
    editorRef.current.focus();
  };

  return (
    <motion.div
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.32 }}
      className="sticky top-36 z-30 rounded-3xl bg-white/50 backdrop-blur-md border border-white/20 shadow-md overflow-x-auto"
    >
      <div className="flex items-center gap-2 p-3 whitespace-nowrap min-w-max">
        <ToolbarButton title="Align Left" onClick={() => exec("justifyLeft")}>
          <AlignLeft size={18} />
        </ToolbarButton>

        <ToolbarButton title="Align Center" onClick={() => exec("justifyCenter")}>
          <AlignCenter size={18} />
        </ToolbarButton>

        <ToolbarButton title="Align Right" onClick={() => exec("justifyRight")}>
          <AlignRight size={18} />
        </ToolbarButton>

        <ToolbarButton title="Justify" onClick={() => exec("justifyFull")}>
          <AlignJustify size={18} />
        </ToolbarButton>

        <ToolbarButton title="Indent" onClick={() => exec("indent")}>
          <Indent size={18} />
        </ToolbarButton>

        <ToolbarButton title="Outdent" onClick={() => exec("outdent")}>
          <Outdent size={18} />
        </ToolbarButton>
      </div>
    </motion.div>
  );
}

function ToolbarButton({ children, onClick, title }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.06 }}
      onClick={onClick}
      title={title}
      className="flex items-center justify-center p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
    >
      {children}
    </motion.button>
  );
}
