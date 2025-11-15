// "use client";

// import React, { useRef, useState } from "react";
// import Navbar from "../components/Navbar";
// import TextEditorToolbar from "../components/TextEditorToolbar";
// import TextAlignmentToolbar from "../components/TextAlignmentToolbar";
// import ImageDragResizeHandler from "../components/ImageDragResizeHandler";

// import { useUser } from "@clerk/nextjs";
// import { toast } from "react-toastify";
// import { marked } from "marked";
// import { motion } from "framer-motion";
// import DownloadIcon from "../components/DownloadIcon";
// import ImageGalleryPicker from "../components/ImageGalleryPicker";
// import SuggestTitles from "../components/SuggestTitles";
// import Tittle from "./Tittle";
// import DOMPurify from "dompurify"; // ✅ sanitization

// export default function WriteHere() {
//   const { isSignedIn, user } = useUser();
//   const [category, setCategory] = useState("");
//   const [title, setTitle] = useState("");
//   const [markdownContent, setMarkdownContent] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const editorRef = useRef(null);

//   // ✅ AI Generate
//   const handleGenerateContent = async () => {
//     if (!isSignedIn) return toast.error("You must be signed in to use AI!");
//     if (!title.trim()) return toast.error("Please enter a title first.");

//     setIsGenerating(true);
//     try {
//       const res = await fetch("/api/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         toast.error(data.message || "Error generating blog content.");
//         setIsGenerating(false);
//         return;
//       }

//       // ✅ sanitize AI output before inserting
//       const html = DOMPurify.sanitize(marked(data.output || ""));
//       setMarkdownContent(html);

//       if (editorRef.current) {
//         editorRef.current.innerHTML = html;
//         editorRef.current.dataset.images = JSON.stringify(data.imageUrls || []);
//       }

//       toast.success("✨ Blog generated with images!");
//     } catch (err) {
//       console.error("AI Generation Error:", err);
//       toast.error("Error generating content.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // ✅ Blog Submit
//   const handleSubmit = async () => {
//     if (!isSignedIn) return toast.error("You must be signed in to post!");

//     const htmlContent = editorRef.current?.innerHTML || "";
//     const imageUrls = JSON.parse(editorRef.current?.dataset.images || "[]");

//     if (!title.trim() || !htmlContent.trim() || !category.trim()) {
//       return toast.error("Title, content, and category are required.");
//     }

//     try {
//       const normalizedCategory = category.trim().toLowerCase();

//       const res = await fetch("/api/blog", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title,
//           content: DOMPurify.sanitize(htmlContent), // ✅ sanitize before send
//           images: imageUrls,
//           authorId: user.id,
//           authorName: user.fullName || "Anonymous",
//           category: normalizedCategory,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success("🎉 Blog posted!");
//         setTitle("");
//         setCategory("");
//         setMarkdownContent("");
//         if (editorRef.current) {
//           editorRef.current.innerHTML = "";
//           editorRef.current.dataset.images = "[]";
//         }
//       } else {
//         toast.error(data.message || "Blog submission failed.");
//       }
//     } catch (err) {
//       console.error("Blog Submission Error:", err);
//       toast.error("Something went wrong while submitting.");
//     }
//   };

//   return (
//     <div className="mt-20 min-h-screen bg-white text-gray-900 relative">
//       <Navbar />

//       {/* 🚫 Warning if not logged in */}
//       {!isSignedIn && (
//         <div className="bg-red-100 text-red-600 p-3 rounded-md text-center mt-4 max-w-3xl mx-auto">
//           🚫 You must sign in to write or generate blogs.
//         </div>
//       )}

//       <div className="max-w-5xl flex jsc mx-auto mt-30 px-4">
//         <Tittle text1="Feel free to write" text2="Your Blogs" />
//       </div>

//       <div className="w-full sticky top-20 z-30">
//         <div className="max-w-5xl mx-auto mt-4 px-4 flex flex-wrap items-center justify-between gap-4">
//           {/* Toolbar */}
//           <div className="flex-1 min-w-[250px] overflow-x-auto">
//             <TextEditorToolbar editorRef={editorRef} horizontal />
//           </div>

//           {/* Dashboard Button */}
//           <a
//             href="/writer/dashboard"
//             className="bg-amber-600 text-white flex items-center px-4 py-2 rounded-lg hover:bg-amber-700 transition"
//           >
//             My Dashboard
//           </a>
//         </div>
//         <div className="flex-1 min-w-[250px] overflow-x-auto">
//           <TextAlignmentToolbar editorRef={editorRef} horizontal />
//         </div>
//       </div>

//       {/* Main Content */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="relative z-10 max-w-5xl mx-auto mt-6 px-4"
//       >
//         <div className="bg-gray-50 border border-gray-200 shadow-lg rounded-2xl p-5 sm:p-8">
//           <div className="flex flex-col md:flex-row gap-4 mb-6">
//             <div className="flex-1 z-50">
//               <SuggestTitles
//                 value={title}
//                 onChange={setTitle}
//                 onTitleSelect={setTitle}
//               />
//             </div>

//             <input
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               placeholder="Category"
//               className="w-full md:w-[250px] h-14 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 pl-3 text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//             />
//           </div>

//           {/* Editable Text Area */}
//           <div className="relative">
//             <div
//               contentEditable={isSignedIn} // ✅ disable for guests
//               ref={editorRef}
//               onInput={(e) => {
//                 const clean = DOMPurify.sanitize(e.currentTarget.innerHTML);
//                 setMarkdownContent(clean);
//               }}
//               className={`border border-gray-300 rounded-xl min-h-[300px] p-5 prose max-w-none text-gray-900 focus:outline-none overflow-auto ${
//                 isSignedIn ? "bg-white" : "bg-gray-100 cursor-not-allowed"
//               }`}
//             />
//             {/* 🖼️ Image drag + resize handler */}
//             {isSignedIn && <ImageDragResizeHandler editorRef={editorRef} />}

//             {/* Loader overlay */}
//             {isGenerating && (
//               <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-xl z-20">
//                 <motion.div
//                   className="w-12 h-12 border-4 border-t-amber-500 border-gray-300 rounded-full"
//                   animate={{ rotate: 360 }}
//                   transition={{
//                     repeat: Infinity,
//                     duration: 1,
//                     ease: "linear",
//                   }}
//                 />
//                 <p className="mt-3 text-amber-600 font-medium">
//                   Generating content...
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Buttons only if logged in */}
//           {isSignedIn && (
//             <div className="mt-8 flex flex-wrap gap-2 sm:gap-4 justify-end">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 onClick={handleSubmit}
//                 className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 sm:px-6 rounded-lg shadow-md transition-all"
//               >
//                 📝 <span className="hidden sm:inline">Submit</span>
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 disabled={isGenerating}
//                 onClick={handleGenerateContent}
//                 className={`flex items-center gap-2 ${
//                   isGenerating
//                     ? "bg-amber-400 cursor-not-allowed"
//                     : "bg-amber-500 hover:bg-amber-600"
//                 } text-white py-2 px-4 sm:px-6 rounded-lg shadow-md transition-all`}
//               >
//                 ✨ <span className="hidden sm:inline">Generate</span>
//               </motion.button>

//               <DownloadIcon editorRef={editorRef} title={title} />
//               <ImageGalleryPicker editorRef={editorRef} />
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// }



"use client";

import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import TextEditorToolbar from "../components/TextEditorToolbar";
import TextAlignmentToolbar from "../components/TextAlignmentToolbar";
import ImageDragResizeHandler from "../components/ImageDragResizeHandler";

import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { marked } from "marked";
import { motion } from "framer-motion";
import DownloadIcon from "../components/DownloadIcon";
import ImageGalleryPicker from "../components/ImageGalleryPicker";
import SuggestTitles from "../components/SuggestTitles";
import Tittle from "./Tittle";
import DOMPurify from "dompurify"; // ✅ sanitization

export default function WriteHere() {
  const { isSignedIn, user } = useUser();
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const editorRef = useRef(null);

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
      console.error("AI Generation Error:", err);
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
      console.error("Blog Submission Error:", err);
      toast.error("Something went wrong while submitting.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />

      {/* Warning if not logged in */}
      {!isSignedIn && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md text-center mt-4 max-w-3xl mx-auto shadow-sm">
          🚫 You must sign in to write or generate blogs.
        </div>
      )}

      {/* Page Title */}
      <div className="max-w-5xl mx-auto mt-28 px-4">
        <Tittle text1="Feel free to write" text2="Your Blogs" />
      </div>

      {/* Toolbar */}
      <div className="w-full sticky top-24 z-30 bg-gray-50/80 backdrop-blur-md shadow-sm py-3">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[250px] overflow-x-auto">
            <TextEditorToolbar editorRef={editorRef} horizontal />
          </div>

          <a
            href="/writer/dashboard"
            className="bg-amber-600 text-white flex items-center px-4 py-2 rounded-xl hover:bg-amber-700 transition-all shadow-md"
          >
            My Dashboard
          </a>
        </div>
        <div className="max-w-5xl mx-auto px-4 mt-2 flex-1 min-w-[250px] overflow-x-auto">
          <TextAlignmentToolbar editorRef={editorRef} horizontal />
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-5xl mx-auto mt-6 px-4"
      >
        <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl p-6 sm:p-10">
          {/* Title + Category */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 z-50">
              <SuggestTitles
                value={title}
                onChange={setTitle}
                onTitleSelect={setTitle}
              />
            </div>

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full md:w-[250px] h-14 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 pl-4 text-lg rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
            />
          </div>

          {/* Editable Text Area */}
          <div className="relative">
            <div
              contentEditable={isSignedIn}
              ref={editorRef}
              onInput={(e) => {
                const clean = DOMPurify.sanitize(e.currentTarget.innerHTML);
                setMarkdownContent(clean);
              }}
              className={`border border-gray-300 rounded-2xl min-h-[350px] p-6 prose max-w-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 overflow-auto transition-all ${
                isSignedIn ? "bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            />

            {isSignedIn && <ImageDragResizeHandler editorRef={editorRef} />}

            {/* Loader overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-2xl z-20">
                <motion.div
                  className="w-14 h-14 border-4 border-t-amber-500 border-gray-300 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <p className="mt-3 text-amber-600 font-semibold">
                  Generating content...
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}
          {isSignedIn && (
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2 px-5 rounded-2xl shadow-lg transition-all font-medium"
              >
                📝 <span className="hidden sm:inline">Submit</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                disabled={isGenerating}
                onClick={handleGenerateContent}
                className={`flex items-center gap-2 ${
                  isGenerating
                    ? "bg-amber-400 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600"
                } text-white py-2 px-5 rounded-2xl shadow-lg transition-all font-medium`}
              >
                ✨ <span className="hidden sm:inline">Generate</span>
              </motion.button>

              <DownloadIcon editorRef={editorRef} title={title} />
              <ImageGalleryPicker editorRef={editorRef} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
