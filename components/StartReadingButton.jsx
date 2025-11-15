"use client";

import React from "react";
import { useRouter } from "next/navigation";

const StartReadingButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/ourwrittings");
  };

  return (
    <button
      onClick={handleClick}
      className="mt-10 ml-5 w-52 text-xl hover:bg-amber-500 animate-pulse bg-amber-400 h-16 rounded-full shadow-md transition"
    >
      Start Reading
    </button>
  );
};

export default StartReadingButton;
