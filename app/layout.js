'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppContextProvider } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // ✅ Import Footer

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ToastContainer position="top-right" autoClose={2000} />
          <AppContextProvider>
            <Navbar />
            {children}  {/* Main page content */}
            <Footer />   {/* ✅ Footer added here */}
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
