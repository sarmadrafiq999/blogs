"use client";

import React from "react";
import { FaLock, FaUserShield, FaFileAlt, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const PrivacyPolicyPage = () => {
  const points = [
    {
      icon: <FaLock className="text-amber-500 text-3xl" />,
      title: "Secure Data",
      description: "All user information is encrypted and stored safely.",
    },
    {
      icon: <FaUserShield className="text-amber-500 text-3xl" />,
      title: "Controlled Editing",
      description: "Only authorized users (writers and admins) can edit content.",
    },
    {
      icon: <FaFileAlt className="text-amber-500 text-3xl" />,
      title: "Privacy First",
      description: "No personal information is sold or shared with third parties.",
    },
    {
      icon: <FaShieldAlt className="text-amber-500 text-3xl" />,
      title: "Secure Authentication",
      description: "Authentication is handled securely via Clerk.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-amber-500 mb-4">
          Privacy Policy
        </h1>
        <div className="max-w-3xl mx-auto mb-12 text-center space-y-4">
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
            At <span className="font-semibold text-amber-500">SRBlogs</span>, your data is{" "}
            <span className="text-amber-500 font-medium">fully secure</span>.
          </p>
          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
            Only the <span className="text-amber-500 font-medium">writer</span> who created a blog or an{" "}
            <span className="text-amber-500 font-medium">admin</span> can modify it, ensuring full control.
          </p>
          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed">
            Authentication is powered by <span className="text-amber-500 font-medium">Clerk</span>, keeping your account safe and reliable.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {points.map((point, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6, type: "spring", stiffness: 70 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 15px 25px rgba(0,0,0,0.4)" }}
            className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer"
          >
            {point.icon}
            <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-100">{point.title}</h3>
            <p className="text-gray-300">{point.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
