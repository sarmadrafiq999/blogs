"use client";
import React from "react";
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
    if (!editorRef.current) return;
    document.execCommand(command, false, null);
    editorRef.current.focus();
  };

  return (
    <div className="sticky top-36 z-20 mt-4 rounded-2xl backdrop-blur-lg bg-gradient-to-r border-b border-white/20 shadow-lg overflow-x-auto">
      <div className="flex items-center gap-3 p-3 text-black whitespace-nowrap min-w-max w-full justify-start md:justify-center">
        {/* Align Left */}
        <button
          onClick={() => exec("justifyLeft")}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-transform duration-150 shadow-md"
          title="Align Left"
        >
          <AlignLeft size={18} />
        </button>

        {/* Align Center */}
        <button
          onClick={() => exec("justifyCenter")}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-transform duration-150 shadow-md"
          title="Align Center"
        >
          <AlignCenter size={18} />
        </button>

        {/* Align Right */}
        <button
          onClick={() => exec("justifyRight")}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-transform duration-150 shadow-md"
          title="Align Right"
        >
          <AlignRight size={18} />
        </button>

        {/* Justify */}
        <button
          onClick={() => exec("justifyFull")}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-transform duration-150 shadow-md"
          title="Justify"
        >
          <AlignJustify size={18} />
        </button>

        {/* Indent */}
        <button
          onClick={() => exec("indent")}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-transform duration-150 shadow-md"
          title="Increase Indent"
        >
          <Indent size={18} />
        </button>

        {/* Outdent */}
        <button
          onClick={() => exec("outdent")}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-transform duration-150 shadow-md"
          title="Decrease Indent"
        >
          <Outdent size={18} />
        </button>
      </div>
    </div>
  );
}
