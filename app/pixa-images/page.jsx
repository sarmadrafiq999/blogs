"use client";
import { useState, useEffect } from "react";
import { Download, Search } from "lucide-react"; // Added Search icon

export default function TestImagesPage() {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedImages = localStorage.getItem("pixabay_images");
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    setImages([]);
    try {
      const res = await fetch("/api/pixa-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      setImages(data.imageUrls || []);
      localStorage.setItem("pixabay_images", JSON.stringify(data.imageUrls || []));
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (url, idx) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `pixabay_image_${idx + 1}.jpg`;
    link.click();
  };

  return (
    <div className="p-6 mt-20 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎨 Get Free AI Images (via Pixabay)</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter a keyword..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-2 border rounded"
        />

        {/* ✅ For larger screens: show text button */}
        <button
          onClick={fetchImages}
          disabled={loading}
          className="hidden sm:block px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Images"}
        </button>

        {/* ✅ For small screens: show icon button */}
        <button
          onClick={fetchImages}
          disabled={loading}
          className="sm:hidden p-2 bg-orange-500 text-white rounded disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <span className="text-xs">...</span>
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((url, idx) => (
          <div key={idx} className="relative border rounded overflow-hidden group">
            <img
              src={url}
              alt={`Pixabay ${idx + 1}`}
              className="w-full rounded"
            />

            {/* ✅ Mobile view (<640px): floating download icon */}
            <button
              onClick={() => downloadImage(url, idx)}
              className="absolute top-2 right-2 bg-orange-500 text-white p-2 rounded-full sm:hidden"
            >
              <Download className="w-5 h-5" />
            </button>

            {/* ✅ Desktop view (>=640px): full button below image */}
            <div className="hidden sm:block text-center mt-2">
              <button
                onClick={() => downloadImage(url, idx)}
                className="px-3 py-1 bg-orange-500 text-white rounded"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
