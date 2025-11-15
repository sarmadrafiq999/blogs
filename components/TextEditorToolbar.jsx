"use client";
import React from "react";
import { Bold, Italic, Underline, Paintbrush, Type } from "lucide-react";

export default function TextEditorToolbar({ editorRef }) {
  const exec = (command, value = null) => {
    if (!editorRef.current) return;
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleColorChange = (e) => exec("foreColor", e.target.value);
  const handleBgColorChange = (e) => exec("hiliteColor", e.target.value);
  const handleFontSizeChange = (e) => exec("fontSize", e.target.value);
  const handleFontFamilyChange = (e) => exec("fontName", e.target.value);

  return (
    <div className="sticky top-20 z-30 rounded-2xl backdrop-blur-lg bg-gradient-to-r border-b border-white/20 shadow-lg overflow-x-auto">
      <div className="flex items-center gap-3 p-3 text-black whitespace-nowrap min-w-max w-full justify-start md:justify-center">
        {/* Bold */}
        <button
          onClick={() => exec("bold")}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-transform duration-150 shadow-md"
          title="Bold"
        >
          <Bold size={18} />
        </button>

        {/* Italic */}
        <button
          onClick={() => exec("italic")}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-transform duration-150 shadow-md"
          title="Italic"
        >
          <Italic size={18} />
        </button>

        {/* Underline */}
        <button
          onClick={() => exec("underline")}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-transform duration-150 shadow-md"
          title="Underline"
        >
          <Underline size={18} />
        </button>

        {/* Font Size */}
        <select
          onChange={handleFontSizeChange}
          className="text-sm text-black border border-black/20 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg hover:bg-white/20 transition"
          title="Font Size"
          defaultValue="3"
        >
          <option className="text-black" value="1">10</option>
          <option className="text-black" value="2">13</option>
          <option className="text-black" value="3">16</option>
          <option className="text-black" value="4">18</option>
          <option className="text-black" value="5">24</option>
          <option className="text-black" value="6">32</option>
          <option className="text-black" value="7">40</option>
        </select>

        {/* Font Family */}
        <select
          onChange={handleFontFamilyChange}
          className="text-sm text-black border border-black/20 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg hover:bg-white/20 transition"
          title="Font Family"
          defaultValue="Arial"
        >
          <option className="text-black" value="Arial">Arial</option>
          <option className="text-black" value="Times New Roman">Times</option>
          <option className="text-black" value="Georgia">Georgia</option>
          <option className="text-black" value="Courier New">Courier</option>
          <option className="text-black" value="Verdana">Verdana</option>
          <option className="text-black" value="monospace">Monospace</option>
        </select>

        {/* Text Color Picker */}
        <label
          className="flex items-center gap-1 p-1 rounded-lg bg-white/10 hover:bg-white/20 hover:scale-105 transition-transform duration-150 shadow-md cursor-pointer"
          title="Text Color"
        >
          <Type size={16} />
          <input type="color" onChange={handleColorChange} className="w-6 h-6 cursor-pointer" />
        </label>

        {/* Background Color Picker */}
        <label
          className="flex items-center gap-1 p-1 rounded-lg bg-white/10 hover:bg-white/20 hover:scale-105 transition-transform duration-150 shadow-md cursor-pointer"
          title="Background"
        >
          <Paintbrush size={16} />
          <input type="color" onChange={handleBgColorChange} className="w-6 h-6 cursor-pointer" />
        </label>
      </div>
    </div>
  );
}
