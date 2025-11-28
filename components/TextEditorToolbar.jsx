"use client";
import React from "react";
import { motion } from "framer-motion";
import { Bold, Italic, Underline, Type, Paintbrush } from "lucide-react";

export default function TextEditorToolbar({ editorRef }) {
  const exec = (command, value = null) => {
    if (!editorRef?.current) return;
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleColorChange = (e) => exec("foreColor", e.target.value);
  const handleBgColorChange = (e) => exec("hiliteColor", e.target.value);
  const handleFontSizeChange = (e) => exec("fontSize", e.target.value);
  const handleFontFamilyChange = (e) => exec("fontName", e.target.value);

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="sticky top-20 z-40 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-md overflow-x-auto"
    >
      <div className="flex items-center gap-2 p-3 whitespace-nowrap min-w-max">
        {/* Toolbar Buttons */}
        <ToolbarButton onClick={() => exec("bold")} title="Bold">
          <Bold size={18} className="text-gray-100" />
        </ToolbarButton>

        <ToolbarButton onClick={() => exec("italic")} title="Italic">
          <Italic size={18} className="text-gray-100" />
        </ToolbarButton>

        <ToolbarButton onClick={() => exec("underline")} title="Underline">
          <Underline size={18} className="text-gray-100" />
        </ToolbarButton>

        {/* Font Size Select */}
        <select
          onChange={handleFontSizeChange}
          defaultValue="3"
          className="text-sm px-2 py-1 rounded-md bg-[#1b1b1f] text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="1" className="bg-[#1b1b1f] text-gray-100">10</option>
          <option value="2" className="bg-[#1b1b1f] text-gray-100">13</option>
          <option value="3" className="bg-[#1b1b1f] text-gray-100">16</option>
          <option value="4" className="bg-[#1b1b1f] text-gray-100">18</option>
          <option value="5" className="bg-[#1b1b1f] text-gray-100">24</option>
          <option value="6" className="bg-[#1b1b1f] text-gray-100">32</option>
          <option value="7" className="bg-[#1b1b1f] text-gray-100">40</option>
        </select>

        {/* Font Family Select */}
        <select
          onChange={handleFontFamilyChange}
          defaultValue="Arial"
          className="text-sm px-2 py-1 rounded-md bg-[#1b1b1f] text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="Arial" className="bg-[#1b1b1f] text-gray-100">Arial</option>
          <option value="Times New Roman" className="bg-[#1b1b1f] text-gray-100">Times</option>
          <option value="Georgia" className="bg-[#1b1b1f] text-gray-100">Georgia</option>
          <option value="Courier New" className="bg-[#1b1b1f] text-gray-100">Courier</option>
          <option value="Verdana" className="bg-[#1b1b1f] text-gray-100">Verdana</option>
          <option value="monospace" className="bg-[#1b1b1f] text-gray-100">Monospace</option>
        </select>

        {/* Text color picker */}
        <label title="Text color" className="flex items-center gap-1 p-1 rounded-md cursor-pointer">
          <Type size={16} className="text-gray-100" />
          <input type="color" onChange={handleColorChange} className="w-6 h-6" />
        </label>

        {/* Background color picker */}
        <label title="Background color" className="flex items-center gap-1 p-1 rounded-md cursor-pointer">
          <Paintbrush size={16} className="text-gray-100" />
          <input type="color" onChange={handleBgColorChange} className="w-6 h-6" />
        </label>
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
      className="flex items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-100 transition-shadow shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
    >
      {children}
    </motion.button>
  );
}
