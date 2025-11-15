"use client";
import Loader from "../components/Loader";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserRound, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AllBlogsList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  // ✅ Fetch all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/admin/blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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
      router.push("/admin/all-blogs");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader />;
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

              <div className="flex items-center gap-4 mt-4">
                <Link href={`/admin/user/${blog.authorId}/blog/${blog._id}`}>
                  <button className="px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition">
                    Read more →
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(blog._id)}
                  disabled={deletingId === blog._id}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                  {deletingId === blog._id ? "Deleting..." : "Delete"}
                </button>
              </div>
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
