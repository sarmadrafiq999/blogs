'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaUser, FaHome, FaPenFancy } from 'react-icons/fa';
import { UserButton, useUser } from '@clerk/nextjs';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoInClick = () => {
    if (isSignedIn) {
      window.location.href = '/navelms';
    } else {
      window.location.href = '/sign-in?redirect_url=/navelms';
    }
  };

  const isWriter = user?.publicMetadata?.role === 'writer';

  return (
    <nav
      className={`w-full py-3 px-4 md:px-6 bg-white/90 backdrop-blur-md border-b border-gray-200 fixed top-0 z-50 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      {/* Logo */}
      <div className="flex-shrink-0 text-lg font-bold">
        <span className="text-orange-500">SR</span>
        <span className="text-black">Blogs</span>
      </div>

      {/* Center Links */}
      {/* Above sm show full text links */}
      <div className="hidden sm:flex flex-1 justify-center space-x-8 text-lg font-medium text-gray-800">
        <Link href="/" className="flex items-center gap-1 hover:text-orange-500 transition">
          <FaHome /> Home
        </Link>
        <Link href="/write" className="flex items-center gap-1 hover:text-orange-500 transition">
          <FaPenFancy /> Write
        </Link>
        {isWriter && (
          <Link
            href="/writer/dashboard"
            className="flex items-center gap-1 hover:text-orange-500 transition"
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* Mobile Center Icons (below sm) */}
      <div className="flex sm:hidden flex-1 justify-center space-x-8 text-orange-500 text-xl">
        <Link href="/" className="flex items-center justify-center">
          <FaHome />
        </Link>
        <Link href="/write" className="flex items-center justify-center">
          <FaPenFancy />
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleGoInClick}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition"
        >
          GO IN
        </button>

        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" afterSignInUrl="/navelms" />
        ) : (
          <div
            onClick={() => (window.location.href = '/sign-in')}
            className="cursor-pointer text-orange-500"
          >
            <FaUser />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
