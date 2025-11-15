"use client";

import React from "react";
import Link from "next/link";
import {
  FaHome,
  FaPenFancy,
  FaBook,
  FaStar,
  FaImage,
  FaTachometerAlt,
  FaInfoCircle,
  FaEnvelope,
  FaFileAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

const NavelmsPage = () => {
  const { user, isLoaded } = useUser();

  // Default sections (visible to all users)
  const sections = [
    {
      title: "Home",
      icon: <FaHome className="text-4xl text-orange-500" />,
      description: "Explore the latest blogs and stories.",
      link: "/",
    },
    {
      title: "Write",
      icon: <FaPenFancy className="text-4xl text-orange-500" />,
      description: "Feel free to write and share your thoughts.",
      link: "/write",
    },
    {
      title: "Read",
      icon: <FaBook className="text-4xl text-orange-500" />,
      description: "Enjoy reading community blogs and ideas.",
      link: "/ourwrittings",
    },
    {
      title: "Favourites",
      icon: <FaStar className="text-4xl text-orange-500" />,
      description: "View and manage your saved blogs.",
      link: "/favourites",
    },
    {
      title: "Imgs",
      icon: <FaImage className="text-4xl text-orange-500" />,
      description: "Find and use free images for your posts.",
      link: "/pixa-images",
    },
    {
      title: "About Us",
      icon: <FaInfoCircle className="text-4xl text-orange-500" />,
      description: "Learn more about SRBlogs’ mission and values.",
      link: "/about",
    },
    {
      title: "Contact Us",
      icon: <FaEnvelope className="text-4xl text-orange-500" />,
      description: "Reach out to our team for any help or feedback.",
      link: "/contact",
    },
    {
      title: "Docs",
      icon: <FaFileAlt className="text-4xl text-orange-500" />,
      description: "Access SRBlogs documentation and usage guide.",
      link: "/docs",
    },
    {
      title: "Privacy Policy",
      icon: <FaShieldAlt className="text-4xl text-orange-500" />,
      description: "Read how we protect your data and privacy.",
      link: "/privacy-policy",
    },
  ];

  // ✅ Add dashboard links based on role
  if (isLoaded) {
    const role = user?.publicMetadata?.role;

    if (role === "admin") {
      sections.push(
        {
          title: "Admin Dashboard",
          icon: <FaTachometerAlt className="text-4xl text-orange-500" />,
          description: "Manage users, posts, and analytics.",
          link: "/admin",
        },
        {
          title: "Writer Dashboard",
          icon: <FaPenFancy className="text-4xl text-orange-500" />,
          description: "Access and manage your blog posts.",
          link: "/writer/dashboard",
        }
      );
    } else if (role === "writer") {
      sections.push({
        title: "Writer Dashboard",
        icon: <FaTachometerAlt className="text-4xl text-orange-500" />,
        description: "Access and manage your blog posts.",
        link: "/writer/dashboard",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-20 px-5">
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-center mb-12 text-orange-600"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Explore SRBlogs Features
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.5,
              type: "spring",
              stiffness: 70,
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Link
              href={section.link}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center border border-orange-100 hover:border-orange-400 group block"
            >
              <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                {section.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-orange-600">
                {section.title}
              </h2>
              <p className="text-gray-600 text-sm">{section.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NavelmsPage;
