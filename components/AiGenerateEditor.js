"use client";

import React from "react";
import { toast } from "react-toastify";

export default function AiGenerateEditor({ generatedBlog, onSave }) {
  const handleSave = async () => {
    try {
      const res = await fetch("/api/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatedBlog),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("AI blog saved successfully!");
      onSave?.(); // Notify parent to clear or redirect
    } catch (err) {
      console.error("Failed to save AI blog:", err);
      toast.error("Error saving AI-generated blog.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{generatedBlog.title}</h2>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: generatedBlog.content }}
      />
      <button
        onClick={handleSave}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        💾 Save AI Blog
      </button>
    </div>
  );
}
