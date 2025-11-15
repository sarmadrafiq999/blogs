"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SeparateComments({ blogId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comment/${blogId}/get`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [blogId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-6 mb-6 p-4 border rounded-lg bg-white shadow"
    >
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li key={index} className="border-b pb-2">
              <p className="text-sm text-gray-700">{comment.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                By: {comment.userName || "Anonymous"} •{" "}
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
