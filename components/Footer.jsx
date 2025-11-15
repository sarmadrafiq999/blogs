"use client";

import React from "react";
import Link from "next/link";
import { FaArrowUp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-0">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-bold text-orange-500 mb-2">SRBlogs</h2>
          <p className="text-gray-400">
            SRBlogs is a secure and modern platform for writers and readers. Only verified writers and admins can manage blogs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-orange-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/write" className="hover:text-orange-500 transition">
                Write
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-orange-500 transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-orange-500 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Docs */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Legal & Docs</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/docs" className="hover:text-orange-500 transition">
                Docs
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-orange-500 transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-400 flex flex-col sm:flex-row justify-between items-center px-6">
        <span>© {new Date().getFullYear()} SRBlogs. All rights reserved.</span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-2 sm:mt-0 flex items-center gap-2 text-orange-500 hover:text-orange-400 transition"
        >
          <FaArrowUp /> Back to Top
        </button>
      </div>
    </footer>
  );
};

export default Footer;
