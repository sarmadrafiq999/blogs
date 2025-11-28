"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AllBlogsList from "../../../components/AllBlogsList";
import Tittle from "../../../components/Tittle";
import Loader from "../../../components/Loader";

export default function AllBlogsPage() {
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
    <div className="p-6 pt-28 min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="flex justify-center">
        <Tittle text1={"All"} text2={"Blogs"} dark={true} />
      </div>

      <div className="mt-8">
        <AllBlogsList dark={true} />
      </div>
    </div>
  );
}
