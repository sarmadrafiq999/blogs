"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaBook, FaCode, FaCogs, FaEdit, FaCircle } from "react-icons/fa";

const docsSections = [
  {
    id: "getting-started",
    icon: <FaBook className="text-4xl text-amber-500" />,
    title: "Getting Started",
    desc: "Creating your first blog is simple and quick.",
    points: [
      "Creating a blog is quite simple. It's just 2-3 clicks.",
      "Enter the title (or select from suggestions) and click generate.",
      "The blog will automatically generate with three images.",
      "You can also pick images manually from the gallery.",
    ],
  },
  {
    id: "api-reference",
    icon: <FaCode className="text-4xl text-amber-500" />,
    title: "API Reference",
    desc: "Explore available API endpoints.",
    points: ["There are no endpoints currently. They will be added later."],
  },
  {
    id: "settings",
    icon: <FaCogs className="text-4xl text-amber-500" />,
    title: "Settings",
    desc: "Manage your account easily.",
    points: [
      "There is no rocket science to manage your account.",
      "Clerk is implemented, which is highly secure and provides easy account management.",
    ],
  },
  {
    id: "editing",
    icon: <FaEdit className="text-4xl text-amber-500" />,
    title: "Editing",
    desc: "Modify text and images effortlessly.",
    points: [
      "For text: select the text and apply any styling you want.",
      "For images: click to resize using the handle at the bottom-right corner.",
      "Change position using arrows for left/right placement.",
      "Drag & drop: double-click, move, release, then click again for text to cover white space automatically.",
    ],
  },
];

const DocsPage = () => {
  const sectionRefs = useRef({});

  const handleScroll = (id) => {
    sectionRefs.current[id].scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-gray-100 py-20 px-4">
      {/* Heading */}
      <motion.h1
        className="text-5xl font-bold text-amber-500 text-center mb-12"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Documentation
      </motion.h1>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {docsSections.map((doc, idx) => (
          <motion.div
            key={doc.id}
            onClick={() => handleScroll(doc.id)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(0,0,0,0.3)" }}
            className="cursor-pointer bg-white/10 backdrop-blur-2xl rounded-2xl p-6 flex flex-col items-center text-center border border-white/20 hover:border-amber-500 transition-all"
          >
            <div className="mb-4">{doc.icon}</div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">{doc.title}</h2>
            <p className="text-gray-300 text-sm">{doc.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto space-y-16">
        {docsSections.map((doc) => (
          <motion.div
            key={doc.id}
            ref={(el) => (sectionRefs.current[doc.id] = el)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              {doc.icon}
              <h2 className="text-3xl font-bold text-amber-500">{doc.title}</h2>
            </div>
            <div className="flex flex-col gap-4">
              {doc.points.map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <FaCircle className="mt-2 text-amber-500 text-xs flex-shrink-0" />
                  <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
                    {point.split(" ").map((word, i) =>
                      ["blog", "image", "Clerk", "resize", "drag & drop"].includes(word) ? (
                        <span key={i} className="text-amber-500 font-medium">{word} </span>
                      ) : (
                        word + " "
                      )
                    )}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DocsPage;
