// components/BlogCard.js
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const BlogCard = ({ blog }) => {
  if (!blog) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <Link href={`/bloglist/${blog._id}`}>
        {blog.images?.[0] && (
          <img
            src={blog.images[0]}
            alt={blog.title || "Blog image"}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.jpg";
            }}
          />
        )}
        <div className="p-4">
          <h2 className="text-xl font-bold text-blue-700 mb-2 line-clamp-2">
            {blog.title || "Untitled Blog"}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {blog.content
              ? blog.content.replace(/<[^>]+>/g, "").slice(0, 150)
              : "No content available"}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString()
              : "Unknown date"}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;