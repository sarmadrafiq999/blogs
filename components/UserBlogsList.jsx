"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserRound, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "./Loader";

export default function UserBlogsList({ userId }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ✅ Fetch blogs for this user
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`/api/admin/blogs/user/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBlogs();
  }, [userId]);

  // ✅ Delete blog handler
  const handleDelete = async (blogId) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    setDeletingId(blogId);
    try {
      const res = await fetch(`/api/admin/blogs/${blogId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete blog");

      toast.success("Blog deleted successfully");
      // Remove from UI
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  if (!blogs.length) return <p className="p-6 text-lg">No blogs found.</p>;

  return (
    <div className="space-y-12">
      {blogs.map((blog) => (
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
                {blog.title}
              </h2>
              <p className="text-gray-600 line-clamp-3 text-sm">
                {blog.content.replace(/<[^>]+>/g, "").slice(0, 250)}...
              </p>

              <Link href={`/admin/user/${userId}/blog/${blog._id}`}>
                <button className="text-blue-600 font-medium hover:underline mt-2">
                  Read more →
                </button>
              </Link>
            </div>

            {/* ✅ Blog Image */}
            {blog.images?.length > 0 && (
              <img
                src={blog.images[0]}
                alt="Blog"
                className="w-full sm:w-64 h-40 object-cover rounded-lg shadow-md"
              />
            )}

            {/* ✅ Delete Button */}
            <button
              onClick={() => handleDelete(blog._id)}
              disabled={deletingId === blog._id}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium mt-4 sm:mt-0"
            >
              <Trash2 className="w-5 h-5" />
              {deletingId === blog._id ? "Deleting..." : ""}
            </button>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6 h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-full origin-left"
          />
        </motion.div>
      ))}
    </div>
  );
}
