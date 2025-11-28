// --------------------------- Final Enhanced Dark + Glassmorphism Editor (Option A) ---------------------------
"use client";

import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import TextEditorToolbar from "../components/TextEditorToolbar";
import TextAlignmentToolbar from "../components/TextAlignmentToolbar";
import ImageDragResizeHandler from "../components/ImageDragResizeHandler";

import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { marked } from "marked";
import { motion } from "framer-motion";
import { FaFolderOpen, FaPaperPlane, FaMagic } from "react-icons/fa"; // FontAwesome icons
import DownloadIcon from "../components/DownloadIcon";
import ImageGalleryPicker from "../components/ImageGalleryPicker";
import SuggestTitles from "../components/SuggestTitles";
import Tittle from "./Tittle";
import DOMPurify from "dompurify";

export default function WriteHere() {
  const { isSignedIn, user } = useUser();
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (isSaving) {
      const t = setTimeout(() => setIsSaving(false), 1200);
      return () => clearTimeout(t);
    }
  }, [isSaving]);

  const handleGenerateContent = async () => {
    if (!isSignedIn) return toast.error("You must be signed in to use AI!");
    if (!title.trim()) return toast.error("Please enter a title first.");
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Error generating blog content.");
        setIsGenerating(false);
        return;
      }

      const html = DOMPurify.sanitize(marked(data.output || ""));
      setMarkdownContent(html);

      if (editorRef.current) {
        editorRef.current.innerHTML = html;
        editorRef.current.dataset.images = JSON.stringify(data.imageUrls || []);
      }

      toast.success("✨ Blog generated with images!");
    } catch (err) {
      console.error(err);
      toast.error("Error generating content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!isSignedIn) return toast.error("You must be signed in to post!");
    const htmlContent = editorRef.current?.innerHTML || "";
    const imageUrls = JSON.parse(editorRef.current?.dataset.images || "[]");

    if (!title.trim() || !htmlContent.trim() || !category.trim()) {
      return toast.error("Title, content, and category are required.");
    }

    try {
      const normalizedCategory = category.trim().toLowerCase();

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: DOMPurify.sanitize(htmlContent),
          images: imageUrls,
          authorId: user.id,
          authorName: user.fullName || "Anonymous",
          category: normalizedCategory,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("🎉 Blog posted!");
        setTitle("");
        setCategory("");
        setMarkdownContent("");
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
          editorRef.current.dataset.images = "[]";
        }
      } else {
        toast.error(data.message || "Blog submission failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while submitting.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-gray-100 relative pb-20">
      <Navbar />

      {!isSignedIn && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 p-3 rounded-md text-center mt-4 max-w-3xl mx-auto shadow-lg backdrop-blur-md">
          🚫 You must sign in to write or generate blogs.
        </div>
      )}

      <div className="max-w-6xl mx-auto mt-15 px-4">
        <Tittle text1="Write Freely" text2="Create Brilliant Blogs" />
      </div>

      {/* TOOLBAR */}
      <div className="sticky top-20 z-50 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl shadow-xl p-2 mx-auto max-w-6xl flex flex-wrap gap-2 justify-center overflow-x-auto">
        <TextEditorToolbar editorRef={editorRef} />
      </div>

      <div className="sticky top-36 z-40 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl shadow-xl p-2 mx-auto max-w-6xl flex flex-wrap gap-2 justify-center mt-2 overflow-x-auto">
        <TextAlignmentToolbar editorRef={editorRef} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-6xl mx-auto mt-6 px-4"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-none min-h-[450px] overflow-auto">
          {/* TITLE + CATEGORY */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 z-50">
              <SuggestTitles value={title} onChange={setTitle} onTitleSelect={setTitle} />
            </div>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full md:w-[260px] h-14 bg-white/10 border border-white/20 text-gray-100 placeholder-gray-400 pl-4 text-lg rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 backdrop-blur-xl"
            />
          </div>

          {/* EDITOR */}
          <div className="relative">
            <div
              contentEditable={isSignedIn}
              ref={editorRef}
              onInput={(e) => setMarkdownContent(DOMPurify.sanitize(e.currentTarget.innerHTML))}
              className={`border border-white/20 rounded-2xl min-h-[350px] p-6 prose max-w-none text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 overflow-auto backdrop-blur-xl text-base leading-relaxed ${
                isSignedIn ? "bg-white/5" : "bg-white/5 cursor-not-allowed"
              }`}
            />

            {isSignedIn && <ImageDragResizeHandler editorRef={editorRef} />}

            {isGenerating && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center rounded-2xl z-20">
                <motion.div
                  className="w-14 h-14 border-4 border-t-amber-500 border-gray-700 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <p className="mt-3 text-amber-400 font-semibold">Generating content...</p>
              </div>
            )}
          </div>

          {/* BUTTONS */}
          {isSignedIn && (
            <div className="mt-8 flex flex-wrap gap-8 sm:gap-4 justify-end">
              {/* My Uploads */}
              <motion.a
                href="/writer/dashboard"
                whileHover={{ scale: 1.05 }}
                className="group relative flex flex-col items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-2xl shadow-lg backdrop-blur-xl"
              >
                <FaFolderOpen size={20} />
                <span className="absolute bottom-[-2rem] text-xs text-white opacity-0 sm:group-hover:opacity-100 transition-all hidden sm:inline">
                  My Uploads
                </span>
              </motion.a>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSubmit}
                className="group relative flex flex-col items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-2xl shadow-lg"
              >
                <FaPaperPlane size={20} />
                <span className="absolute bottom-[-2rem] text-xs text-white opacity-0 sm:group-hover:opacity-100 transition-all hidden sm:inline">
                  Submit
                </span>
              </motion.button>

              {/* Generate */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                disabled={isGenerating}
                onClick={handleGenerateContent}
                className={`group relative flex flex-col items-center gap-1 ${
                  isGenerating
                    ? "bg-amber-400/40 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700"
                } text-white py-2 px-4 rounded-2xl shadow-lg`}
              >
                <FaMagic size={20} />
                <span className="absolute bottom-[-2rem] text-xs text-white opacity-0 sm:group-hover:opacity-100 transition-all hidden sm:inline">
                  Generate
                </span>
              </motion.button>

              <DownloadIcon editorRef={editorRef} />
              <ImageGalleryPicker editorRef={editorRef} />
            </div>
          )}
        </div>
      </motion.div>

      {/* FLOATING AUTOSAVE INDICATOR */}
      {isSaving && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 bg-green-600 text-white py-2 px-4 rounded-xl shadow-xl backdrop-blur-xl"
        >
          ✔️ Saved
        </motion.div>
      )}
    </div>
  );
}
