// components/AdminBlogList.jsx
"use client";

import React, { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function AdminBlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterUser, setFilterUser] = useState("");
  const [modal, setModal] = useState({ show: false, blogId: null, type: "" });

  // Fetch blogs (all or by user)
  const fetchBlogs = async (authorName = "") => {
    try {
      setLoading(true);
      let url = `/api/admin/blogs`;
      if (authorName) url += `?authorName=${encodeURIComponent(authorName)}`;

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.error || "Failed to fetch blogs");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete single blog
  const deleteBlog = async (blogId) => {
    try {
      const res = await fetch(`/api/bloglist/${blogId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setBlogs(blogs.filter((b) => b._id !== blogId));
      else console.error(data);
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  // Delete all blogs
  const deleteAllBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs", { method: "DELETE" });
      const data = await res.json();
      if (data.success) setBlogs([]);
      else console.error(data);
    } catch (err) {
      console.error("Failed to delete all blogs:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Blog Management</h1>

      {/* Filter by user */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Filter by author name"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="border rounded px-3 py-2 w-60"
        />
        <button
          onClick={fetchBlogs}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
        <button
          onClick={() => setModal({ show: true, type: "all" })}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete All
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Author</th>
              <th className="p-2 text-left">Created At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border-b">
                <td className="p-2">{blog.title}</td>
                <td className="p-2">{blog.authorName}</td>
                <td className="p-2">
                  {new Date(blog.createdAt).toLocaleString()}
                </td>
                <td className="p-2 flex gap-2 justify-center">
                  <button
                    onClick={() =>
                      setModal({ show: true, blogId: blog._id, type: "single" })
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirm Modal */}
      {modal.show && (
        <ConfirmModal
          type={modal.type}
          onConfirm={() => {
            if (modal.type === "single") deleteBlog(modal.blogId);
            if (modal.type === "all") deleteAllBlogs();
            setModal({ show: false, blogId: null, type: "" });
          }}
          onCancel={() => setModal({ show: false, blogId: null, type: "" })}
        />
      )}
    </div>
  );
}
