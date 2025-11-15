"use client";

import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useAppContext } from "../context/AppContext";

export default function LikeButton({ blogId }) {
  const { isSignedIn, user } = useUser();
  const {
    blogInteractions,
    fetchBlogInteractions,
    toggleLike,
  } = useAppContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blogId) {
      fetchBlogInteractions(blogId).finally(() => setLoading(false));
    }
  }, [blogId]);

  const interactions = blogInteractions[blogId] || { likes: [] };

  // ✅ Ensure likes is always an array
  const likes = Array.isArray(interactions.likes)
    ? interactions.likes
    : [];

  const likeCount = likes.length;
  const liked = isSignedIn && user?.id && likes.includes(user.id);

  const handleLike = async () => {
    if (!isSignedIn) {
      alert("Please sign in to like this post.");
      return;
    }

    setLoading(true);
    await toggleLike(blogId);
    await fetchBlogInteractions(blogId); // keep synced with dislike button
    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-1 px-4 py-2 rounded-xl transition ${
        liked ? "bg-green-100 text-red-600" : "bg-amber-400 hover:bg-amber-300"
      }`}
    >
      <ThumbsUp
        className={`w-5 h-5 transition ${
          liked ? "fill-red-500 stroke-red-600" : "fill-none stroke-white"
        }`}
      />
      <span className="font-medium">{likeCount}</span>
    </button>
  );
}
