'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaUser, FaHome, FaPenFancy } from 'react-icons/fa';
import { UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

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
      className={`
        w-full py-3 px-4 md:px-6 fixed top-0 z-50
        flex items-center justify-between
        transition-all duration-300
        backdrop-blur-xl
        border-b border-gray-800
        ${scrolled ? 'bg-black/70 shadow-xl shadow-black/40' : 'bg-black/50'}
      `}
    >
      {/* Logo */}
      <div
        onClick={() => router.push('/')}
        className="flex-shrink-0 text-lg font-extrabold cursor-pointer select-none"
      >
        <span className="text-orange-500 drop-shadow-md">SR</span>
        <span className="text-white">Blogs</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex flex-1 justify-center space-x-10 text-gray-300 text-lg font-medium">
        <Link
          href="/"
          className="flex items-center gap-2 hover:text-orange-400 hover:drop-shadow transition"
        >
          <FaHome /> Home
        </Link>

        <Link
          href="/write"
          className="flex items-center gap-2 hover:text-orange-400 hover:drop-shadow transition"
        >
          <FaPenFancy /> Write
        </Link>

        {isWriter && (
          <Link
            href="/writer/dashboard"
            className="flex items-center gap-2 hover:text-orange-400 hover:drop-shadow transition"
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* Mobile Icons */}
      <div className="flex sm:hidden flex-1 justify-center space-x-10 text-orange-500 text-xl">
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
          className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold
          hover:bg-orange-500 transition shadow-md hover:shadow-orange-600/30"
        >
          GO IN
        </button>

        {isSignedIn ? (
          <UserButton
            afterSignOutUrl="/"
            afterSignInUrl="/navelms"
            appearance={{
              elements: {
                avatarBox: 'ring-2 ring-orange-500 shadow-md',
              },
            }}
          />
        ) : (
          <div
            onClick={() => (window.location.href = '/sign-in')}
            className="cursor-pointer text-orange-500 hover:text-orange-400 transition text-xl"
          >
            <FaUser />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
