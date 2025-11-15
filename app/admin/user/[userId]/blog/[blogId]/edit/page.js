"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AdminEditBlog from "../../../../../../../components/AdminEditBlog";
import Loader from "../../../../../../../components/Loader";

export default function AdminEditBlogPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // 🔒 Frontend admin protection
  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== "admin") {
      router.push("/"); // redirect non-admins
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) return <Loader />;

  if (user?.publicMetadata?.role !== "admin") return null;

  return (
    <div className="mt-20">
      <AdminEditBlog />
    </div>
  );
}
