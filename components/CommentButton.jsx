"use client";

import { MessageCircle, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CommentButton({ blogId }) {
  const [showBox, setShowBox] = useState(false);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!comment.trim()) {
      toast.error("Please write something before posting!");
      return;
    }

    setPosting(true);

    try {
      const res = await fetch(`/api/comment/${blogId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Comment posted successfully! 🎉");
        setComment("");
        setShowBox(false);
      } else {
        toast.error(data.message || "Failed to post comment.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Something went wrong.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="relative">
      {/* Comment Button */}
      <button
        onClick={() => setShowBox((prev) => !prev)}
        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 transition"
      >
        <MessageCircle className="w-5 h-5 stroke-white" />
        <span className="font-mediumn text-white">Comment</span>
      </button>

      {/* Chat-style Comment Box */}
      {showBox && (
        <div className="absolute bottom-12 right-0 w-64 bg-white shadow-lg rounded-xl p-3 border border-gray-200 z-50">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handlePost}
              disabled={posting}
              className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-md transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {posting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> Post
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
