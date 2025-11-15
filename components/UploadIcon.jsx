"use client";
import React from "react";
import { FaUpload } from "react-icons/fa";

const UploadIcon = () => {
  return (
    <div className="flex items-center gap-2">
      <label className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
        <FaUpload className="inline mr-1" />
        Choose File
        <input
          type="file"
          accept="image/*,application/pdf"
          hidden
        />
      </label>

      <button
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Upload
      </button>
    </div>
  );
};

export default UploadIcon;
