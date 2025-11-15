"use client";

import { useEffect, useState } from "react";
import { ThumbsDown } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useAppContext } from "../context/AppContext";

export default function DisLikeButton({ blogId }) {
  const { isSignedIn, user } = useUser();
  const {
    blogInteractions,
    fetchBlogInteractions,
    toggleDislike,
  } = useAppContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blogId) {
      fetchBlogInteractions(blogId).finally(() => setLoading(false));
    }
  }, [blogId]);

  const interactions = blogInteractions[blogId] || { dislikes: [] };

  // ✅ Ensure dislikes is always an array
  const dislikes = Array.isArray(interactions.dislikes)
    ? interactions.dislikes
    : [];

  const dislikeCount = dislikes.length;
  const disliked = isSignedIn && user?.id && dislikes.includes(user.id);

  const handleDislike = async () => {
    if (!isSignedIn) {
      alert("Please sign in to dislike this post.");
      return;
    }

    setLoading(true);
    await toggleDislike(blogId);
    await fetchBlogInteractions(blogId); // keep synced with like button
    setLoading(false);
  };

  return (
    <button
      onClick={handleDislike}
      disabled={loading}
      className={`flex items-center  gap-1 px-4 py-2 rounded-xl transition ${
        disliked ? "bg-red-100 text-red-600" : "bg-amber-400 hover:bg-amber-300"
      }`}
    >
      <ThumbsDown
        className={`w-5 h-5 transition ${
          disliked
            ? "fill-red-500 stroke-red-600"
            : "fill-none stroke-white"
        }`}
      />
      <span className="font-medium">{dislikeCount}</span>
    </button>
  );
}
