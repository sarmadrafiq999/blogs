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

    // --- CREATE LOADER ELEMENT AT CURSOR ---
    const loader = document.createElement("div");
    loader.className =
      "my-4 flex flex-col items-center justify-center w-full py-10 rounded-xl bg-gray-100 border border-gray-300 text-gray-600 animate-pulse";

    loader.innerHTML = `
      <div class="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-3 font-medium text-amber-600">Uploading...</p>
    `;

    // Insert loader at cursor
    const selection = window.getSelection();
    let range;
    if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      range.collapse(true);
      range.insertNode(loader);

      // Move cursor after loader
      range.setStartAfter(loader);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { secure_url } = await res.json();

      // Create final image element
      const imgEl = document.createElement("img");
      imgEl.src = secure_url;
      imgEl.alt = "Uploaded Image";
      imgEl.className =
        "my-4 rounded-xl shadow-lg w-full max-h-[400px] object-contain border border-gray-600";

      // Replace loader with image
      loader.replaceWith(imgEl);

      // Add a blank space after the image
      const spacer = document.createElement("p");
      spacer.innerHTML = "<br>";
      imgEl.parentNode.insertBefore(spacer, imgEl.nextSibling);

      // Move cursor inside spacer
      const newRange = document.createRange();
      newRange.setStart(spacer, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      // Save the uploaded image URL
      if (editorRef.current) {
        const existing = JSON.parse(editorRef.current.dataset.images || "[]");
        existing.push(secure_url);
        editorRef.current.dataset.images = JSON.stringify(existing);
      }

      toast.success("✅ Image uploaded!");

    } catch (error) {
      console.error(error);
      toast.error("❌ Upload failed.");
      loader.remove(); // remove loader if failed

    } finally {
      e.target.value = ""; // Reset input
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
