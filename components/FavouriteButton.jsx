"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FavouriteButton({ writerId }) {
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  // ✅ Check if the writer is already favourited when the component mounts
  useEffect(() => {
    const checkFavourite = async () => {
      if (!isSignedIn || !user) return;

      try {
        const res = await fetch(`/api/favourites/check?writerId=${writerId}`);
        const data = await res.json();

        if (res.ok && data.isFavourite) {
          setAdded(true);
        }
      } catch (err) {
        console.error("❌ Error checking favourite:", err);
      }
    };

    checkFavourite();
  }, [isSignedIn, user, writerId]);

  // ✅ Add to favourites handler
  const handleFavourite = async () => {
    if (!isSignedIn) {
      toast.error("You must be logged in to favourite a writer.");
      return;
    }

    if (added) {
      toast.info("Already in favourites!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/favourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ writerId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to add favourite");
      } else {
        toast.success(data.message || "Writer added to favourites!");
        setAdded(true);
      }
    } catch (err) {
      console.error("❌ Favourite error:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavourite}
      disabled={loading || added}
      className={`w-full px-4 py-2 rounded-lg text-white transition
        ${added ? "bg-green-500 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"}
      `}
    >
      {loading ? "Adding..." : added ? "Favourited ✅" : "Add to Favourites"}
    </button>
  );
}
