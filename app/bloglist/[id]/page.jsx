"use client";

import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { useUser } from "@clerk/nextjs";
import { Copy, Facebook, Twitter, Clock, X, Pencil } from "lucide-react";
import { motion } from "framer-motion";
// import LikeButton from "../../../components/LikeButton";
import DisLikeButton from "../../../components/Dislike";
import LikeButton from "../../../components/LikeButton";
import DownloadIcon from "../../../components/DownloadIcon";
import CommentButton from "../../../components/CommentButton";
import SeparateComments from "../../../components/SeparateComments";
import Shimmer from "../../../components/Shimmer";
import FavouriteButton from "../../../components/FavouriteButton";
import { toast } from "react-toastify";

export default function BlogDetailPage() {
  const router = useRouter();
  const contentRef = useRef(null);
  const { blogData } = useAppContext();
  const { id } = useParams();
  const { user } = useUser();

  const [showComments, setShowComments] = useState(false);
  const [authorData, setAuthorData] = useState(null);
  const [authorLoading, setAuthorLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(true);
  const [mobileAuthorOpen, setMobileAuthorOpen] = useState(false);

  const blog = blogData.find((item) => item._id?.toString() === id);
  const cleanContent = blog?.content?.replace(/\s*w-full\s*/g, "") || "";

  useEffect(() => {
    if (blogData.length > 0) setBlogLoading(false);
  }, [blogData]);

  useEffect(() => {
    if (blog?.authorId) {
      fetch(`/api/author/${blog.authorId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setAuthorData(data);
        })
        .catch(() => toast.error("Error fetching author"))
        .finally(() => setAuthorLoading(false));
    } else {
      setAuthorLoading(false);
    }
  }, [blog?.authorId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("🔗 Blog link copied!");
  };

  const handleAuthorClick = () => {
    if (!blog?.authorId && !blog?.authorName) return;
    const authorIdentifier =
      blog.authorId || encodeURIComponent(blog.authorName || "unknown");
    router.push(`/authors/${authorIdentifier}`);
  };

  if (blogLoading || authorLoading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4">
          <Shimmer />
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 text-xl text-red-500">
          Blog not found
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
{/* 🔝 Top Action Bar */}
<div className="fixed top-20 left-0 right-0 flex flex-wrap justify-between px-4 md:px-8 z-40 gap-2">
  {/* Copy + Download */}
  <div className="flex gap-2">
    <button
      onClick={handleCopy}
      className="bg-amber-500 hover:bg-amber-400 text-white px-3 py-2 rounded-lg flex items-center gap-2 shadow transition"
    >
      <Copy className="w-4 h-4" />
      <span className="hidden sm:inline">Copy</span>
    </button>
    <DownloadIcon editorRef={contentRef} title={blog.title} />
  </div>

  {/* Social Share */}
  <div className="flex gap-2">
    <a
      href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-amber-500 text-white px-3 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2 shadow transition"
    >
      <Twitter className="w-4 h-4" />
      <span className="hidden sm:inline">Tweet</span>
    </a>
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2 shadow transition"
    >
      <Facebook className="w-4 h-4" />
      <span className="hidden sm:inline">Share</span>
    </a>
  </div>
</div>


      {/* 🔑 Main Layout */}
      <div className="max-w-7xl mx-auto mt-36 px-4 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-[1fr_250px] gap-8">
        {/* Blog Content */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6"
          >
            {/* ✏️ Edit Button */}
            {user && blog.authorId === user.id && (
              <button
                onClick={() => router.push(`/bloglist/${blog._id}/edit`)}
                className="absolute top-4  z-50 right-4 p-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-md transition"
                title="Edit Blog"
              >
                <Pencil className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Author Button */}
            {authorData && (
              <div className="md:hidden mb-4 flex justify-end">
                <button
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
                  onClick={() => setMobileAuthorOpen(true)}
                >
                  About Writer
                </button>
              </div>
            )}

            {/* Blog Images */}
            {blog.images?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
              >
                {blog.images.map((src, i) => (
                  <motion.img
                    key={i}
                    src={src}
                    alt={`blog-img-${i}`}
                    className="w-full h-[220px] object-cover rounded-xl shadow-md"
                    whileHover={{ scale: 1.02 }}
                  />
                ))}
              </motion.div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-amber-700 to-amber-500 text-transparent bg-clip-text mb-4">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(blog.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Content */}
            <motion.div
              ref={contentRef}
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </motion.div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 text-black items-center">
            <LikeButton blogId={blog._id} />
            <DisLikeButton blogId={blog._id} />
            <CommentButton blogId={blog._id} />
          </div>

          {/* Comments */}
          <div className="mt-6">
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="bg-amber-500 text-white px-4 py-2 mb-4 rounded-xl hover:bg-amber-600 transition"
            >
              {showComments ? "Hide Comments" : "Read Comments"}
            </button>

            {showComments && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <SeparateComments blogId={blog._id} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Author Sidebar (Desktop) */}
        {authorData && (
          <aside className="hidden md:flex flex-col items-center bg-white shadow-lg rounded-xl p-4 h-fit sticky top-24">
            <img
              src={authorData.imageUrl}
              alt={authorData.fullName}
              className="w-20 h-20 rounded-full object-cover"
            />
            <h3 className="mt-3 font-bold text-center">
              {authorData.fullName}
            </h3>
            <p className="text-gray-500 text-sm text-center">
              {authorData.emailAddress}
            </p>
            <button
              onClick={handleAuthorClick}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg w-full transition"
            >
              All By This Writer
            </button>
            <div className="mt-3 w-full">
              <FavouriteButton writerId={blog.authorId} />
            </div>
          </aside>
        )}
      </div>

      {/* 📱 Mobile Author Modal */}
      {mobileAuthorOpen && authorData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm relative">
            <button
              onClick={() => setMobileAuthorOpen(false)}
              className="absolute top-3 right-3"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={authorData.imageUrl}
              alt={authorData.fullName}
              className="w-20 h-20 rounded-full object-cover mx-auto"
            />
            <h3 className="mt-3 text-center font-bold">
              {authorData.fullName}
            </h3>
            <p className="text-gray-500 text-sm text-center">
              {authorData.emailAddress}
            </p>
            <button
              onClick={handleAuthorClick}
              className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition"
            >
              All By This Writer
            </button>
            <div className="mt-3">
              <FavouriteButton writerId={blog.authorId} />

              {/* <LikeButton /> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
