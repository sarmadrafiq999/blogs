"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ShowDashboardButton() {
  const { user } = useUser();
  const [hasBlogs, setHasBlogs] = useState(false);

  useEffect(() => {
    const checkBlogs = async () => {
      if (!user) return;

      try {
        const res = await fetch(`/api/bloglist/writer/${user.id}`);
        const data = await res.json();

        if (res.ok && data.blogs?.length > 0) {
          setHasBlogs(true);
        }
      } catch (err) {
        console.error("Error checking blogs:", err);
      }
    };

    checkBlogs();
  }, [user]);

  if (!user || !hasBlogs) return null;

  return (
    <Link
      href="/writer/dashboard"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      My Dashboard
    </Link>
  );
}
