"use client";
import React from "react";

export default function BlogDetailShimmer({ includeAuthor = true }) {
  return (
    <div className="animate-pulse bg-gradient-to-b from-[#0b0b0d] via-[#121214] to-[#1a1a1f] min-h-screen text-gray-200">
      {/* 🔝 Top Action Bar Skeleton */}
      <div className="fixed top-20 left-0 right-0 flex flex-wrap justify-between px-4 md:px-8 z-40 gap-2 backdrop-blur-lg bg-white/10 rounded-xl p-2">
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-700/40 rounded-lg"></div>
          <div className="h-10 w-28 bg-gray-700/40 rounded-lg"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-700/40 rounded-lg"></div>
          <div className="h-10 w-28 bg-gray-700/40 rounded-lg"></div>
        </div>
      </div>

      {/* 🔑 Main Layout */}
      <div className="max-w-7xl mx-auto mt-36 px-4 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-[1fr_250px] gap-8">
        {/* Blog Content */}
        <div className="flex flex-col gap-6">
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6">
            {/* Title */}
            <div className="h-10 w-3/4 bg-gray-700/40 rounded mb-6"></div>

            {/* Meta Info */}
            <div className="flex gap-6 mb-6">
              <div className="h-4 w-28 bg-gray-700/40 rounded"></div>
              <div className="h-4 w-20 bg-gray-700/40 rounded"></div>
            </div>

            {/* Blog Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="h-44 w-full bg-gray-700/40 rounded-xl"></div>
              <div className="h-44 w-full bg-gray-700/40 rounded-xl hidden sm:block"></div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-700/40 rounded"></div>
              <div className="h-4 w-11/12 bg-gray-700/40 rounded"></div>
              <div className="h-4 w-10/12 bg-gray-700/40 rounded"></div>
              <div className="h-4 w-9/12 bg-gray-700/40 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-700/40 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-700/40 rounded"></div>
            </div>
          </div>

          {/* Actions (Like, Dislike, Comment) */}
          <div className="flex flex-wrap gap-3">
            <div className="h-10 w-24 bg-gray-700/40 rounded-xl"></div>
            <div className="h-10 w-24 bg-gray-700/40 rounded-xl"></div>
            <div className="h-10 w-28 bg-gray-700/40 rounded-xl"></div>
          </div>
        </div>

        {/* Author Sidebar Skeleton */}
        {includeAuthor && (
          <aside className="hidden md:flex flex-col items-center bg-white/10 backdrop-blur-2xl shadow-2xl rounded-xl p-4 h-fit sticky top-24">
            <div className="w-20 h-20 bg-gray-700/40 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-700/40 rounded mt-3"></div>
            <div className="h-3 w-32 bg-gray-700/40 rounded mt-2"></div>
            <div className="h-10 w-full bg-gray-700/40 rounded-lg mt-4"></div>
            <div className="h-10 w-full bg-gray-700/40 rounded-lg mt-3"></div>
          </aside>
        )}
      </div>
    </div>
  );
}
