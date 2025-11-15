"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CategoryScroller({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    };

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  const scroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8; // scroll ~80% of visible width
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full overflow-hidden mt-2 mb-4">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2
          bg-gray-700 text-white rounded-full
          w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
          flex items-center justify-center
          shadow-md hover:bg-gray-800 transition z-10"
        >
          <FaChevronLeft />
        </button>
      )}

      <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-2">
        {/* ALL Button */}
        <button
          onClick={() => onSelect && onSelect("all")}
          className="flex-shrink-0 px-3 sm:px-4 py-2 text-sm sm:text-base
          text-white bg-amber-500 hover:bg-amber-600
          border border-amber-500 hover:border-amber-600
          rounded-full transition-all"
        >
          All
        </button>

        {/* Scrollable Categories */}
        <div
          ref={containerRef}
          className="flex items-center overflow-x-auto no-scrollbar gap-3 sm:gap-4 scroll-smooth"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelect && onSelect(category)}
              className="flex-shrink-0
              px-3 sm:px-4 py-2 text-sm sm:text-base
              text-gray-600 hover:text-gray-800
              border hover:border-amber-500
              rounded-full whitespace-nowrap transition-all"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2
          bg-gray-700 text-white rounded-full
          w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
          flex items-center justify-center
          shadow-md hover:bg-gray-800 transition z-10"
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
}
