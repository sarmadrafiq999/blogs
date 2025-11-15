"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

export default function AdminEditBlog() {
    const { userId, blogId } = useParams();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch blog
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/admin/blogs/${blogId}`);
                if (!res.ok) throw new Error("Failed to fetch blog");
                const data = await res.json();
                setTitle(data.blog.title);
                setContent(data.blog.content);
                setImages(data.blog.images || []);
            } catch (error) {
                console.error(error);
                toast.error("Error loading blog");
            } finally {
                setLoading(false);
            }
        };
        if (blogId) fetchBlog();
    }, [blogId]);

    // --- IMAGE HELPERS ---
    const replaceImgInContent = (oldSrc, newSrc) => {
        setContent((prev) =>
            prev?.replace(
                new RegExp(`<img[^>]+src=["']${oldSrc}["'][^>]*>`, "g"),
                `<img src="${newSrc}" />`
            )
        );
    };

    const removeImgFromContent = (src) => {
        setContent((prev) =>
            prev?.replace(
                new RegExp(`<img[^>]+src=["']${src}["'][^>]*>`, "g"),
                ""
            )
        );
    };

    const handleImageAdd = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...newImages]);
        setContent(
            (prev) =>
                prev + newImages.map((src) => `<img src="${src}" />`).join("")
        );
    };

    const handleReplaceImage = (index, file) => {
        const newSrc = URL.createObjectURL(file);
        const oldSrc = images[index];

        setImages((prev) => {
            const updated = [...prev];
            updated[index] = newSrc;
            return updated;
        });

        replaceImgInContent(oldSrc, newSrc);
    };

    const handleRemoveImage = (index) => {
        const srcToRemove = images[index];
        setImages((prev) => prev.filter((_, i) => i !== index));
        removeImgFromContent(srcToRemove);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/blogs/${blogId}/edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, images }),
            });

            if (!res.ok) throw new Error("Failed to update blog");

            toast.success("Blog updated successfully!");
            router.push(`/admin/user/${userId}/blog/${blogId}`);
        } catch (err) {
            console.error(err);
            toast.error("Error updating blog");
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center">
                <Loader />
            </div>
        );

    return (
        <div className="p-6 mt-0 min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto "
            >
                <h1 className="text-2xl font-bold text-blue-700">Edit Blog</h1>

                {/* Title */}
                <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block font-medium mb-1">Content</label>
                    <div
                        contentEditable
                        suppressContentEditableWarning
                        className="w-full min-h-[200px] p-3 border rounded-lg"
                        onInput={(e) => setContent(e.currentTarget.innerHTML)}
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>

                {/* Images */}
                <div>
                    <label className="block font-medium mb-2">Images</label>
                    <div className="flex flex-wrap gap-4 mb-3">
                        {images.map((img, i) => (
                            <div
                                key={i}
                                className="relative flex flex-col items-center"
                            >
                                <img
                                    src={img}
                                    alt={`blog-img-${i}`}
                                    className="w-32 h-32 object-cover rounded border"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                                >
                                    X
                                </button>

                                <input
                                    type="file"
                                    accept="image/*"
                                    id={`replace-${i}`}
                                    className="hidden"
                                    onChange={(e) =>
                                        handleReplaceImage(i, e.target.files[0])
                                    }
                                />

                                <label
                                    htmlFor={`replace-${i}`}
                                    className="mt-2 cursor-pointer bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                                >
                                    Replace
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-30 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </motion.div>
        </div>
    );
}
