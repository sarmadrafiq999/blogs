"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

export default function TipTapEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    immediatelyRender: false, // ✅ important for Next.js SSR
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (!mounted) {
    return <div className="border rounded-lg bg-white p-2 min-h-[200px]" />; // placeholder while loading
  }

  return (
    <div className="border rounded-lg bg-white p-2">
      <EditorContent editor={editor} className="min-h-[200px]" />
    </div>
  );
}
