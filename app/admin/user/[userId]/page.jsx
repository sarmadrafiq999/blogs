"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import UserBlogsList from "../../../../components/UserBlogsList";
import Loader from "../../../../components/Loader";

export default function UserBlogsPage() {
  const { userId } = useParams();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== "admin") {
      router.push("/"); // redirect non-admins
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) return <Loader />;

  if (user?.publicMetadata?.role !== "admin") return null;

  return (
    <div className="p-6 mt-20 bg-gradient-to-b to-blue-50 min-h-screen">
      <h1 className="flex items-center justify-center text-3xl font-bold mb-8">
        Blogs by User
      </h1>
      <UserBlogsList userId={userId} />
    </div>
  );
}
