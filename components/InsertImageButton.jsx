"use client";
import React, { useRef } from "react";
import { FaImage } from "react-icons/fa";
import { toast } from "react-toastify";

const InsertImageButton = ({ editorRef }) => {
  const inputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        const imgTag = `<img src="${data.url}" alt="Uploaded Image" style="max-width:100%;" />`;
        insertAtCursor(imgTag);
      } else {
        toast.error("Image upload failed.");
      }
    } catch {
      toast.error("Error uploading image.");
    }
  };

  const insertAtCursor = (html) => {
    const el = editorRef.current;
    el.focus();
    document.execCommand("insertHTML", false, html);
  };

  return (
    <>
      <button
        onClick={() => inputRef.current.click()}
        className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
        title="Insert Image"
      >
        <FaImage />
      </button>
      <input
        type="file"
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={handleImageUpload}
      />
    </>
  );
};

export default InsertImageButton;
