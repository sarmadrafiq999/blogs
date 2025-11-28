"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ClerkUsersList from "../../../components/ClerkUsersList";
import Loader from "../../../components/Loader";

export default function ClerkUsersPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== "admin") {
      router.push("/"); // redirect non-admins to home page
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) return <Loader />;

  // Hide content if user is not admin
  if (user?.publicMetadata?.role !== "admin") return null;

  return (
    <div>
      <ClerkUsersList />
    </div>
  );
}
