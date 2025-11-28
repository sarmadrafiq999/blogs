"use client";

import { useState, useEffect, useRef } from "react";

export default function SuggestTitles({ value, onChange, onTitleSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const skipFetchRef = useRef(false);

  useEffect(() => {
    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      return;
    }

    const delayDebounce = setTimeout(() => {
      if (value.length > 5) {
        setLoadingSuggestions(true);

        fetch("/api/suggest-titles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userInput: `${value}. Please suggest only short, concise blog titles of 3-6 words.`,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data.suggestions || []);
          })
          .catch(() => setSuggestions([]))
          .finally(() => setLoadingSuggestions(false));
      } else {
        setSuggestions([]);
        setLoadingSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [value]);

  const handleClick = (title) => {
    skipFetchRef.current = true;
    onChange(title);
    setSuggestions([]);
    setLoadingSuggestions(false);
    if (onTitleSelect) onTitleSelect(title);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto px-2 sm:px-4">
      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your blog title..."
        className="w-full border border-white/20 bg-white/5 shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none p-3 rounded-lg text-gray-100 placeholder-gray-400 text-base transition duration-200"
      />

      {/* Loading */}
      {loadingSuggestions && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white/10 p-3 rounded-lg text-sm text-gray-200 shadow-lg flex items-center gap-2 animate-fadeIn">
          <div className="w-4 h-4 border-2 border-t-transparent border-amber-500 rounded-full animate-spin"></div>
          Loading suggestions...
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute top-full mt-2 left-0 right-0 bg-white/10 border border-white/20 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto animate-slideDown">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleClick(s)}
              className="px-4 py-3 cursor-pointer hover:bg-white/20 transition-colors duration-150 text-gray-100"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
