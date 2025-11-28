"use client";
import { useState, useEffect } from "react";
import { Download, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function TestImagesPage() {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Load saved images only if they are recent (less than 1 day old)
  useEffect(() => {
    const saved = localStorage.getItem("pixabay_images");
    const savedTime = localStorage.getItem("pixabay_images_time");

    if (saved && savedTime) {
      const diff = Date.now() - parseInt(savedTime, 10);
      const oneDay = 24 * 60 * 60 * 1000;

      if (diff < oneDay) {
        setImages(JSON.parse(saved));
        setSearched(true);
      } else {
        localStorage.removeItem("pixabay_images");
        localStorage.removeItem("pixabay_images_time");
      }
    }
  }, []);

  const fetchImages = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setImages([]);
    setSearched(true);

    try {
      const res = await fetch("/api/pixa-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      setImages(data.imageUrls || []);

      localStorage.setItem(
        "pixabay_images",
        JSON.stringify(data.imageUrls || [])
      );
      localStorage.setItem("pixabay_images_time", Date.now().toString());
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
    <div className="min-h-screen w-full bg-[#0b0b0f] text-white p-6 relative">
      {/* Full-screen loader overlay */}
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-[#0b0b0f]/90 z-50 flex items-center justify-center">
          <div className="flex items-center justify-center space-x-2">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                className="w-6 h-6 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(255,191,0,0.5)]"
                animate={{
                  y: [0, -16, 0],
                  boxShadow: [
                    "0 0 4px rgba(255,191,0,0.3)",
                    "0 0 12px rgba(255,191,0,0.6)",
                    "0 0 4px rgba(255,191,0,0.3)",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  ease: "easeInOut",
                  delay,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto mt-20">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-amber-400">
          🎨 Get Free AI Images (via Pixabay)
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter a keyword..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-2 rounded bg-[#111] border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          {/* Large screen button */}
          <button
            onClick={fetchImages}
            disabled={loading}
            className="hidden sm:block px-4 py-2 bg-amber-500 text-white rounded disabled:opacity-50 hover:bg-amber-600 transition"
          >
            {loading ? "Loading..." : "Get Images"}
          </button>

          {/* Small screen icon button */}
          <button
            onClick={fetchImages}
            disabled={loading}
            className="sm:hidden p-2 bg-amber-500 text-white rounded disabled:opacity-50 flex items-center justify-center hover:bg-amber-600 transition"
          >
            {loading ? <span className="text-xs">...</span> : <Search className="w-5 h-5" />}
          </button>
        </div>

        {/* Images grid */}
        {searched && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((url, idx) => (
              <div
                key={idx}
                className="relative border border-white/10 rounded overflow-hidden group bg-[#111]"
              >
                <img
                  src={url}
                  alt={`Pixabay ${idx + 1}`}
                  className="w-full rounded object-cover"
                />

                {/* Mobile floating download */}
                <button
                  onClick={() => downloadImage(url, idx)}
                  className="absolute top-2 right-2 bg-amber-500 text-white p-2 rounded-full sm:hidden hover:bg-amber-600 transition"
                >
                  <Download className="w-5 h-5" />
                </button>

                {/* Desktop full button */}
                <div className="hidden sm:block text-center mt-2">
                  <button
                    onClick={() => downloadImage(url, idx)}
                    className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No images message */}
        {searched && !loading && images.length === 0 && (
          <p className="text-gray-400 mt-6 text-center">
            No images found for "{title}".
          </p>
        )}
      </div>
    </div>
  );
}
