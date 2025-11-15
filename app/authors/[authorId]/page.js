// app/authors/[authorId]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

const AuthorBlogsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [state, setState] = useState({
    blogs: [],
    loading: true,
    error: null,
    authorName: "Author",
  });

  useEffect(() => {
    const fetchAuthorBlogs = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await fetch(
          `/api/bloglist/author/${encodeURIComponent(params.authorId)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setState({
          blogs: data.blogs || [],
          loading: false,
          error: null, // only real errors go here
          authorName: data.authorName || params.authorId,
        });
      } catch (error) {
        console.error("Fetch error:", error);
        setState({
          blogs: [],
          loading: false,
          error: error.message,
          authorName: params.authorId,
        });
      }
    };

    fetchAuthorBlogs();
  }, [params?.authorId]);

  // Loader
  if (state.loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-300 to-blue-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-gray-600 text-lg">Loading blogs...</p>
      </div>
    );
  }

  // API / fetch error
  if (state.error) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-b from-amber-300 to-blue-50">
        <div className="max-w-5xl mx-auto bg-white/80 p-6 rounded-xl shadow-md">
          <div className="flex flex-col items-center text-center py-10">
            <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Content
            </h2>
            <p className="text-gray-600 mb-6">{state.error}</p>
            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Go Back
              </button>
              <button
                onClick={() => router.push("/")}
                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
              >
                Browse All Blogs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-amber-300 to-blue-50">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-amber-600 mb-6 hover:underline"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-amber-800 mb-2">
          {state.authorName}'s Blogs
        </h1>
        <p className="text-gray-600 mb-6">
          {state.blogs.length} {state.blogs.length === 1 ? "article" : "articles"}
        </p>

        {state.blogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {state.blogs.map((blog) => (
              <motion.div
                key={blog?._id || Math.random()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/bloglist/${blog?._id || ""}`}>
                  {blog?.images?.[0] && (
                    <img
                      src={blog.images[0]}
                      alt={blog?.title || "Blog image"}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.jpg";
                        e.currentTarget.alt = "Fallback blog image";
                      }}
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-amber-700 mb-2 line-clamp-2">
                      {blog?.title || "Untitled Blog"}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {blog?.content
                        ? blog.content.replace(/<[^>]+>/g, "").slice(0, 150)
                        : "No content available"}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {blog?.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 p-8 rounded-xl text-center">
            <p className="text-gray-600 text-lg">No blogs found for this author.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorBlogsPage;
