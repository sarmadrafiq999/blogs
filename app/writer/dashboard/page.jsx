"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Edit, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const WriterDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const fetchWriterBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bloglist/writer/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch your blogs");

        const data = await response.json();
        setBlogs(data.blogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWriterBlogs();
  }, [user, isSignedIn]);

  // Loading spinner
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0b0f] text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-gray-400 text-lg">
          {loading ? "Loading your blogs..." : "Loading your dashboard..."}
        </p>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to access dashboard</h2>
          <Link href="/sign-in" className="text-amber-400 hover:underline">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Error fetching blogs
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] text-white">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <Link
            href="/"
            className="text-amber-400 hover:underline mt-4 inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 mt-15 bg-[#0b0b0f] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="flex items-center text-amber-400 hover:underline"
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> Home
          </Link>
          <h1 className="text-3xl font-bold">My Uploads</h1>
          <div className="w-24"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-[#111] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-white/10"
            >
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-amber-400">{blog.title}</h2>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {blog.content.replace(/<[^>]+>/g, "").slice(0, 150)}...
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      href={`/bloglist/${blog._id}/edit`}
                      className="p-2 text-amber-400 hover:bg-amber-900/20 rounded-full"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={async () => {
                        if (!confirm("Are you sure you want to delete this blog?")) return;
                        try {
                          const response = await fetch(`/api/bloglist/${blog._id}`, { method: "DELETE" });
                          if (!response.ok) throw new Error("Failed to delete blog");
                          setBlogs(blogs.filter((b) => b._id !== blog._id));
                        } catch (err) {
                          setError(err.message);
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-900/20 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-400 mb-4">
              You haven't written any blogs yet.
            </p>
            <Link
              href="/write"
              className="inline-block bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition"
            >
              Create Your First Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriterDashboard;
