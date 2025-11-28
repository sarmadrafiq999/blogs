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
    <div className="min-h-screen w-full bg-black bg-gradient-to-b from-black via-gray-900 to-black text-gray-100 flex flex-col items-center justify-start">
      {/* Optional: add some padding/margin for content */}
      <div className="w-full p-6 mt-20 mb-4">
        <h1 className="text-3xl font-bold text-center mb-8">Blogs by User</h1>
        <UserBlogsList userId={userId} />
      </div>
    </div>
  );
}
