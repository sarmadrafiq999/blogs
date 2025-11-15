"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Navbar from "../../../../components/Navbar";
import TextEditorToolbar from "../../../../components/TextEditorToolbar";
import TextAlignmentToolbar from "../../../../components/TextAlignmentToolbar";
import ImageDragResizeHandler from "../../../../components/ImageDragResizeHandler";
import { toast } from "react-toastify";

export default function EditBlogPage() {
    const [checkingAuth, setCheckingAuth] = useState(true); // ✅ add this

  const editorRef = useRef(null);
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  // ✅ Fetch blog data on mount
useEffect(() => {
  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/bloglist/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch blog");

      // ✅ Check if the current user is the author
      if (data.blog.authorId !== user?.id) {
        toast.error("You are not authorized to edit this blog");
        router.push("/"); // Redirect to home or dashboard
        return;
      }

      setFormData({
        title: data.blog.title,
        content: data.blog.content,
        images: data.blog.images || [],
      });

      if (editorRef.current) {
        editorRef.current.innerHTML = data.blog.content || "";
      }
    } catch (err) {
      toast.error(err.message);
      router.push("/"); // Redirect if error occurs
    } finally {
      setCheckingAuth(false); // ✅ done checking
    }
  };

  if (id && user) fetchBlog();
}, [id, user]);




  // ✅ Replace Image
  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingIndex(index);

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.secure_url) {
        const newUrl = `${data.secure_url}?t=${Date.now()}`;

        if (editorRef.current) {
          editorRef.current.innerHTML = editorRef.current.innerHTML.replace(
            formData.images[index],
            newUrl
          );
        }

        const updatedImages = [...formData.images];
        updatedImages[index] = newUrl;
        const updatedContent = editorRef.current?.innerHTML || formData.content;

        const payload = {
          ...formData,
          images: updatedImages,
          content: updatedContent,
        };

        const updateRes = await fetch(`/api/bloglist/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!updateRes.ok) throw new Error("Failed to update DB");

        setFormData(payload);
        toast.success("Image replaced & saved!");
      } else {
        toast.error("Image upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploadingIndex(null);
    }
  };

  // ✅ Update Blog
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const currentContent = editorRef.current?.innerHTML || "";
      const payload = {
        ...formData,
        content: currentContent,
      };

      const res = await fetch(`/api/bloglist/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success("Blog updated successfully!");
      router.push(`/bloglist`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (checkingAuth) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Checking permissions...</p>
    </div>
  );
}


  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-20 p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>

        {/* Title */}
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />

        {/* Toolbars */}
        <TextEditorToolbar editorRef={editorRef} />
        <TextAlignmentToolbar editorRef={editorRef} />

        {/* ✅ Editor with ImageDragResizeHandler */}
        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="w-full min-h-[250px] p-3 border rounded-lg mt-2 bg-white"
            onInput={(e) =>
              setFormData((prev) => ({
                ...prev,
                content: e.currentTarget?.innerHTML || "",
              }))
            }
          />
          {/* 👇 Add the drag/resize behavior here */}
          <ImageDragResizeHandler editorRef={editorRef} />
        </div>

        {/* Image Gallery with Replace */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {formData.images.map((src, i) => (
            <div key={i} className="relative group">
              <img
                src={src}
                alt={`Blog image ${i}`}
                className="w-32 h-32 object-cover rounded-lg"
              />

              {uploadingIndex === i && (
                <div className="w-32 absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              <label className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded cursor-pointer opacity-0 group-hover:opacity-100">
                Replace
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, i)}
                  className="hidden"
                />
              </label>
            </div>
          ))}
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </div>
    </div>
  );
}
