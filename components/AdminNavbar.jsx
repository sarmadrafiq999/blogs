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
    <header
      className="
        fixed top-15 left-0 w-full z-40
        bg-gray-950/80 backdrop-blur-xl
        border-b border-gray-800
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
      "
    >
      {/* Logo Center */}
      <div className="w-full py-4 flex justify-center border-b border-gray-800">
        <h1 className="text-2xl font-extrabold text-gray-200 tracking-wide">
          <span className="text-orange-400">SR</span>{" "}
          <span className="text-purple-400">Admin</span>
        </h1>
      </div>

      {/* Navbar Links Below */}
      <nav className="flex justify-center py-3">
        <div className="flex space-x-10 text-lg font-medium">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link key={link.href} href={link.href} className="relative group">
                <span
                  className={`
                    flex items-center gap-2 transition-all
                    ${isActive ? "text-orange-400" : "text-gray-300 group-hover:text-purple-400"}
                  `}
                >
                  {link.icon}
                  {link.label}
                </span>

                {/* Neon Underline */}
                <span
                  className={`
                    absolute left-0 -bottom-1 h-[3px] rounded-full transition-all duration-300
                    bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                ></span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
