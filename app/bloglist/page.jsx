"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import DOMPurify from "dompurify";
import { useAppContext } from "../../context/AppContext";
import LikeButton from "../../components/LikeButton";
import DisLikeButton from "../../components/Dislike";
import CommentButton from "../../components/CommentButton";
import CategoryScroller from "../../components/CategoryScroller";
import { useUser, RedirectToSignIn } from "@clerk/nextjs"; // ✅ Clerk

const BlogList = () => {
  const { isLoaded, isSignedIn } = useUser(); // ✅ auth state
  const { blogData, loading } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const filteredBlogs = useMemo(() => {
    if (!blogData) return [];
    if (!selectedCategory || selectedCategory === "all") return blogData;
    return blogData.filter(
      (blog) => blog?.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [blogData, selectedCategory]);

  // ✅ Wait until Clerk finishes loading
  if (!isLoaded) return <p className="p-6 text-lg">Checking authentication...</p>;

  // ✅ Block unauthenticated users
  if (!isSignedIn) return <RedirectToSignIn />;

  if (loading) return <p className="p-6 text-lg">Loading blogs...</p>;
  if (!filteredBlogs.length)
    return <p className="p-6 text-lg">No blogs found.</p>;

  return (
    <div className="p-6 space-y-12 bg-gradient-to-b mt-20 to-blue-50 min-h-screen">
      <CategoryScroller onSelect={handleCategorySelect} />

      {selectedCategory && (
        <p className="text-lg text-gray-600">
          Showing blogs in:{" "}
          <span className="font-semibold text-blue-600">
            {selectedCategory}
          </span>
        </p>
      )}

      {filteredBlogs.map((blog) => {
        const safeContent = DOMPurify.sanitize(blog?.content || "");
        const preview = safeContent.replace(/<[^>]+>/g, "").slice(0, 250);

        return (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative group"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 bg-white/70 backdrop-blur-md rounded-xl shadow-md p-6 transition hover:shadow-lg">
              <div className="flex-1 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <UserRound className="w-4 h-4 mr-1" />
                  {blog.authorName || "Admin"}
                </div>
                <h2 className="text-2xl font-extrabold text-blue-700">
                  {blog.title || "Untitled Blog"}
                </h2>
                <p className="text-gray-600 line-clamp-3 text-sm">
                  {preview}...
                </p>

                <div className="flex gap-3 pt-3">
                  <LikeButton blogId={blog._id} />
                  <DisLikeButton blogId={blog._id} />
                  <CommentButton blogId={blog._id} />
                </div>

                <Link href={`/bloglist/${blog._id}`}>
                  <button className="text-blue-600 font-medium hover:underline mt-2">
                    Read more →
                  </button>
                </Link>
              </div>

              {blog.images?.length > 0 && (
                <img
                  src={blog.images[0]}
                  alt={blog.title || "Blog Image"}
                  className="w-full sm:w-64 h-40 object-cover rounded-lg shadow-md"
                  loading="lazy"
                />
              )}
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-6 h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-full origin-left"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default BlogList;
