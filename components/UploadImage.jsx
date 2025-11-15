"use client";
import React from "react";
import { FaImage } from "react-icons/fa";

const UploadImage = () => {
  return (
    <div className="mt-4">
      <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded text-blue-800 hover:bg-blue-200">
        <FaImage />
        Insert Image
        <input
          type="file"
          accept="image/*"
          hidden
        />
      </label>
    </div>
  );
};

export default UploadImage;
