"use client";
import { useState } from "react";

export default function ImageTester() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/image-gen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Image Generation Tester</h1>
      <input
        className="border p-2 w-full mb-2"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {result && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Provider: {result.provider}
          </p>
          {result.imageUrl ? (
            <img
              src={result.imageUrl}
              alt="Generated"
              className="mt-2 max-w-full border rounded"
            />
          ) : (
            <p className="text-red-500">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
