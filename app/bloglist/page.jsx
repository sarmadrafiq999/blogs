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
import { useUser, RedirectToSignIn } from "@clerk/nextjs";

const BlogList = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { blogData, loading } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryName) => setSelectedCategory(categoryName);

  const filteredBlogs = useMemo(() => {
    if (!blogData) return [];
    if (!selectedCategory || selectedCategory === "all") return blogData;
    return blogData.filter(
      (blog) => blog?.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [blogData, selectedCategory]);

  if (!isLoaded) return <p className="p-6 text-lg text-gray-300">Checking authentication...</p>;
  if (!isSignedIn) return <RedirectToSignIn />;
  if (loading) return <p className="p-6 text-lg text-gray-300">Loading blogs...</p>;
  if (!filteredBlogs.length) return <p className="p-6 text-lg text-gray-300">No blogs found.</p>;

  return (
    <div className="p-6 space-y-12 bg-gradient-to-b from-[#0b0b0d] via-[#121214] to-[#1a1a1f] min-h-screen mt-20">
      <CategoryScroller onSelect={handleCategorySelect} />

      {selectedCategory && (
        <p className="text-gray-300 text-lg">
          Showing blogs in:{" "}
          <span className="font-semibold text-amber-500">{selectedCategory}</span>
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
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
              <div className="flex-1 space-y-2">
                <div className="flex items-center text-sm text-gray-400">
                  <UserRound className="w-4 h-4 mr-1" />
                  {blog.authorName || "Admin"}
                </div>

                <h2 className="text-2xl font-extrabold text-amber-400 group-hover:text-amber-500 transition-colors">
                  {blog.title || "Untitled Blog"}
                </h2>

                <p className="text-gray-300 line-clamp-3 text-sm">{preview}...</p>

                <div className="flex gap-3 pt-3">
                  <LikeButton blogId={blog._id} />
                  <DisLikeButton blogId={blog._id} />
                  <CommentButton blogId={blog._id} />
                </div>

                <Link href={`/bloglist/${blog._id}`}>
                  <button className="text-amber-500 font-medium hover:underline mt-2">
                    Read more →
                  </button>
                </Link>
              </div>

              {blog.images?.length > 0 && (
                <img
                  src={blog.images[0]}
                  alt={blog.title || "Blog Image"}
                  className="w-full sm:w-64 h-40 object-cover rounded-xl shadow-md"
                  loading="lazy"
                />
              )}
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6 }}
              className="mt-6 h-1 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 rounded-full origin-left"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default BlogList;
