"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Loader from "../../../../../../components/Loader";
import BlogDetail from "../../../../../../components/BlogDetail";

export default function BlogDetailPage() {
  const { userId, blogId } = useParams();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔒 Frontend admin protection
  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== "admin") {
      router.push("/"); // redirect non-admins
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin/blogs/${blogId}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        setBlog(data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) fetchBlog();
  }, [blogId]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (user?.publicMetadata?.role !== "admin") return null;

  return (
    <div className="mt-20">
      <BlogDetail blog={blog} userId={userId} />
    </div>
  );
}
