"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";

export default function CommentModal({ blogId, onClose, onCommentPosted }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken, isLoaded } = useAuth();

  const handleSubmit = async () => {
    if (!isLoaded) {
      toast.error("Please wait while we verify your session");
      return;
    }

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      toast.error("Please write a comment before submitting");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`/api/comment/${blogId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ comment: trimmedComment })
      });

      // Handle response properly
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to post comment");
      }

      toast.success("Comment posted successfully!");
      setComment("");
      onClose();
      if (onCommentPosted) onCommentPosted(); // Refresh comments list

    } catch (error) {
      console.error("Posting error:", error);
      toast.error(error.message || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-4">Write a comment</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !comment.trim()}
          className={`mt-4 px-4 py-2 rounded-lg transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </motion.div>
    </div>
  );
}