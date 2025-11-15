// app/admin/layout.js
"use client";

import React from "react";
import AdminNavbar from "../../components/AdminNavbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Page content */}
      <main className="pt-24 px-6">{children}</main>
    </div>
  );
}
