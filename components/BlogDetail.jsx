"use client";

import { motion } from "framer-motion";
import { UserRound, Edit } from "lucide-react";
import Link from "next/link";

export default function BlogDetail({ blog, userId }) {
  if (!blog) return <p className="p-6 text-lg">Blog not found.</p>;

  return (
    <div className="p-6 mt-0 min-h-screen bg-gradient-to-b">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto rounded-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-600">
            <UserRound className="w-5 h-5 mr-2" />
            {blog.authorName || "Admin"}
          </div>

          {/* Edit Button */}
          <Link href={`/admin/user/${userId}/blog/${blog._id}/edit`}>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Edit className="w-4 h-4" /> Edit
            </button>
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-700 mt-4">
          {blog.title}
        </h1>

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed mt-6"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </motion.div>
    </div>
  );
}
