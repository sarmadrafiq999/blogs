"use client";

import { Loader2 } from "lucide-react";

export default function WriterBlogs({ blogs, loading, writerName }) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">
        Blogs by {writerName}
      </h3>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-gray-500">No blogs found for this writer.</p>
      ) : (
        <ul className="space-y-4">
          {blogs.map((blog) => (
            <li
              key={blog._id}
              className="p-4 bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer"
            >
              <p className="font-semibold text-lg">{blog.title}</p>
              <p className="text-sm text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
