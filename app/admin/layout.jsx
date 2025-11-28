// app/admin/layout.js
"use client";

import React from "react";
import AdminNavbar from "../../components/AdminNavbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      <AdminNavbar />
      <main className="pt-24 px-6">{children}</main>
    </div>
  );
}
