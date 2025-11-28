"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2, Star, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

export default function MyFavourites() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWriterBlogs, setSelectedWriterBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [selectedWriterName, setSelectedWriterName] = useState("");

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch favourites
  useEffect(() => {
    if (!isSignedIn) return;

    const fetchFavourites = async () => {
      try {
        const res = await fetch("/api/favourites");
        if (!res.ok) throw new Error("Failed to fetch favourites");

        const data = await res.json();
        setFavourites(data.favourites || []);
      } catch (err) {
        toast.error("⚠️ Error fetching favourites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [isSignedIn]);

  // Remove Favourite
  const handleRemoveFavourite = async (e, writerId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/favourites/${writerId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFavourites((prev) => prev.filter((f) => f.writerId !== writerId));
        toast.success("✅ Removed from favourites");
      } else {
        toast.error("❌ Failed to remove favourite");
      }
    } catch {
      toast.error("⚠️ Something went wrong");
    }
  };

  // Fetch blogs for selected writer
  const fetchWriterBlogs = async (writerId, writerName) => {
    setSelectedWriterBlogs([]);
    setLoadingBlogs(true);
    setSelectedWriterName(writerName);

    try {
      const res = await fetch(`/api/blogs/user/${writerId}`);
      if (!res.ok) throw new Error("Failed to fetch blogs");

      const data = await res.json();
      if (data.success) {
        setSelectedWriterBlogs(data.blogs);
      } else {
        toast.error("⚠️ Could not load blogs");
      }
    } catch {
      toast.error("⚠️ Error fetching blogs");
    } finally {
      setLoadingBlogs(false);
    }
  };

  if (!isSignedIn) {
    return (
      <p className="text-center text-gray-300 mt-20 py-10">
        Please sign in to see your favourite writers.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 mt-20">
        <Loader />
      </div>
    );
  }

  return (
 <div className="min-h-screen bg-[#0b0b0f] text-white">
      <div className="max-w-4xl mx-auto py-6 px-3 sm:px-6 mt-12">      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2 text-amber-400">
        <Star className="w-6 h-6 text-amber-500" /> My Favourite Writers
      </h2>

      {favourites.length === 0 ? (
        <p className="text-gray-400 text-base sm:text-lg">
          You haven’t added any favourite writers yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <AnimatePresence>
            {favourites.map((fav) => (
              <motion.li
                key={fav.writerId}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="
                  p-4 rounded-xl shadow-md transition cursor-pointer
                  bg-[#111]/60 backdrop-blur-xl border border-white/10
                  hover:bg-[#222]/60 hover:shadow-lg
                "
                onClick={() => fetchWriterBlogs(fav.writerId, fav.writerName)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={fav.writerImage || '/default.png'}
                      alt={fav.writerName}
                      className="w-12 h-12 rounded-full border border-white/20"
                    />
                    <div>
                      <p className="font-semibold text-gray-100">
                        {fav.writerName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {fav.writerEmail}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    whileTap={{ scale: 0.9 }}
                    className="ml-2 p-2 rounded-full hover:bg-red-900/30 text-red-400"
                    onClick={(e) => handleRemoveFavourite(e, fav.writerId)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* Blogs Section */}
      {selectedWriterName && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-amber-400">
            Blogs by {selectedWriterName}
          </h3>

          {loadingBlogs ? (
            <div className="flex justify-center py-6">
              <Loader />
            </div>
          ) : selectedWriterBlogs.length === 0 ? (
            <p className="text-gray-400">No blogs found for this writer.</p>
          ) : (
            <ul className="space-y-4">
              {selectedWriterBlogs.map((blog) => (
                <motion.li
                  key={blog._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="
                    p-4 rounded-xl shadow-md transition cursor-pointer
                    bg-[#111]/60 backdrop-blur-xl border border-white/10
                    hover:bg-[#222]/60 hover:shadow-lg
                  "
                >
                  <Link href={`/bloglist/${blog._id}`}>
                    <div>
                      <p className="font-semibold text-gray-100 text-lg">
                        {blog.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </div>
    </div>
  );
}
