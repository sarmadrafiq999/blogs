"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OnlineUsersCount from "../../../components/OnlineUsersCount";
import Loader from "../../../components/Loader";

export default function OnlineUsersPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== "admin") {
      router.push("/"); // redirect non-admins to home page
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) return <Loader />;

  // Don’t render anything for non-admins
  if (user?.publicMetadata?.role !== "admin") return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <OnlineUsersCount />
    </div>
  );
}
