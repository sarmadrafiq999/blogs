"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaInfoCircle, FaUsers, FaLaptopCode } from "react-icons/fa";

const aboutPoints = [
  {
    icon: <FaInfoCircle className="text-4xl text-amber-500" />,
    title: "Our Mission",
    desc: "To provide a secure and modern blogging platform where writers can freely share ideas.",
  },
  {
    icon: <FaUsers className="text-4xl text-amber-500" />,
    title: "Community",
    desc: "SRBlogs connects writers and readers globally, fostering collaboration and learning.",
  },
  {
    icon: <FaLaptopCode className="text-4xl text-amber-500" />,
    title: "Technology",
    desc: "Built with Next.js, Clerk, and modern tools to ensure a smooth and reliable experience.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-gray-100 py-20">
      {/* Heading */}
      <motion.h1
        className="text-5xl font-bold text-amber-500 text-center mb-12"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About SRBlogs
      </motion.h1>

      {/* Description */}
      <motion.div
        className="max-w-3xl mx-auto mb-12 text-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
          Welcome to{" "}
          <span className="font-semibold text-amber-500">SRBlogs</span>, a
          platform built for passionate writers and curious readers.
        </p>
        <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
          Our mission is to create a{" "}
          <span className="text-amber-500 font-medium">community</span> where
          creativity meets expression and ideas thrive.
        </p>
        <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
          We’re powered by modern technologies to ensure a{" "}
          <span className="text-amber-500 font-medium">secure</span>,{" "}
          <span className="text-amber-500 font-medium">fast</span>, and{" "}
          <span className="text-amber-500 font-medium">reliable</span>{" "}
          experience for all users.
        </p>
      </motion.div>

      {/* Animated Boxes */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {aboutPoints.map((point, idx) => (
          <motion.div
            key={idx}
            className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg rounded-2xl p-6 flex flex-col items-center text-center transition-transform"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.07, rotate: 1 }}
            transition={{
              duration: 0.5,
              delay: idx * 0.2,
              type: "spring",
              stiffness: 100,
            }}
            viewport={{ once: true }}
          >
            <motion.div
              className="mb-4"
              whileHover={{ rotate: 10, scale: 1.2 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {point.icon}
            </motion.div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              {point.title}
            </h2>
            <p className="text-gray-300 text-base">{point.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
