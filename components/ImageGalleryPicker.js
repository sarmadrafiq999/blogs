"use client";

import React, { useRef } from "react";
import { toast } from "react-toastify";
import { ImageIcon } from "lucide-react";

export default function ImageGalleryPicker({ editorRef }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const { secure_url } = await res.json();

      // Create image element
      const imgEl = document.createElement("img");
      imgEl.src = secure_url;
      imgEl.alt = "Uploaded image";

      imgEl.className =
  "my-4 rounded-xl shadow-lg w-full max-h-[400px] object-contain border border-gray-600";




      // Insert at cursor
      // Insert image at the cursor
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        // Insert the image
        range.insertNode(imgEl);

        // Create an empty <p><br></p> after the image
        const spacer = document.createElement("p");
        spacer.innerHTML = "<br>";
        imgEl.parentNode.insertBefore(spacer, imgEl.nextSibling);

        // Move cursor into the new empty line
        range.setStart(spacer, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // Save URL in dataset
      if (editorRef.current) {
        const existing = JSON.parse(editorRef.current.dataset.images || "[]");
        existing.push(secure_url);
        editorRef.current.dataset.images = JSON.stringify(existing);
      }

      toast.success("✅ Image uploaded & inserted!");

    } catch (error) {
      console.error(error);
      toast.error("❌ Image upload failed.");
    } finally {
      e.target.value = ""; // reset input
    }
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current.click()}
        className="flex items-center gap-1 text-white bg-amber-600 hover:bg-amber-700 px-3 py-2 rounded-md shadow-sm"
      >
        <ImageIcon size={18} />
        Upload Image
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
