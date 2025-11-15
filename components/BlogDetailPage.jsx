// components/BlogDetailPage.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "./Navbar"; // existing Navbar
import { motion } from "framer-motion";

export default function BlogDetailPage() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/bloglist/${blogId}`);
        const data = await res.json();
        if (data.success) setBlog(data.blog);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!blog) return <p className="text-center mt-10">Blog not found</p>;

  return (
    <div>
      <Navbar />
      <div className="mt-20">
        <motion.div
        className="max-w-4xl mx-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <p className="text-gray-500 mb-4">
          By <strong>{blog.authorName}</strong> on {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <div
          className="prose max-w-full"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </motion.div>
      </div>
    </div>
  );
}
