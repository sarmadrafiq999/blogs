"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BlogWritersList from "../../components/BlogWritersList";
import Loader from "../../components/Loader";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // 🔒 Redirect if not admin once Clerk is loaded
    if (isLoaded && user?.publicMetadata?.role !== "admin") {
      router.push("/"); // redirect to home
    }
  }, [isLoaded, user, router]);

  // 🕒 Show loader while checking
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  // 🚫 Hide content if user is not admin
  if (user?.publicMetadata?.role !== "admin") {
    return null;
  }

  // ✅ Only admin can see this
  return (
    <div className="mt-20">
      <BlogWritersList />
    </div>
  );
}
