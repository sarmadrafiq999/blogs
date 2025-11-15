// app/components/AdminNavbar.jsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBook, FaUsers, FaPenFancy } from "react-icons/fa";

export default function AdminNavbar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Writers", icon: <FaPenFancy /> },
    { href: "/admin/all-blogs", label: "Blogs", icon: <FaBook /> },
    { href: "/admin/clerk-users", label: "Users", icon: <FaUsers /> },
  ];

  return (
    <header className="fixed top-16 left-0 w-full z-40 bg-gray-300 shadow-md">
      {/* Logo Center */}
      <div className="w-full py-3 flex justify-center border-b border-gray-400">
        <h1 className="text-2xl font-bold">
          <span className="text-orange-500">SR</span>
          <span className="text-black"> Admin</span>
        </h1>
      </div>

      {/* Navbar Links Below */}
      <nav className="flex justify-center py-2">
        <div className="flex space-x-8 text-lg font-medium">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="relative group">
              <span
                className={`${
                  pathname === link.href ? "text-orange-500" : "text-black"
                }`}
              >
                {link.label}
              </span>
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-orange-500 transition-all duration-300 ${
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
