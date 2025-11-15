"use client";

import { useState } from "react";

const BlogTitleInput = ({ blogTitle, setBlogTitle }) => {
  const [loading, setLoading] = useState(false);

  const handleBlur = async () => {
    setLoading(true);
    try {
      console.log("API call placeholder for:", blogTitle);
    } catch (error) {
      console.error("Title check failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <label className="block font-medium">
      Enter Blog Title:
      <input
        type="text"
        value={blogTitle}
        onChange={(e) => setBlogTitle(e.target.value)}
        onBlur={handleBlur}
        className="w-full mt-1 p-2 border rounded-md"
        placeholder="e.g. Future of AI"
      />
      {loading && <p className="text-sm text-blue-600 mt-1">Checking title...</p>}
    </label>
  );
};

export default BlogTitleInput;
