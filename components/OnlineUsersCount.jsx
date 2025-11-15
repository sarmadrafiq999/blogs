"use client";

import { useEffect, useState } from "react";
import Loader from "./Loader"; // ✅ import your Loader

export default function OnlineUsersCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const res = await fetch("/api/admin/users/loggedin");
        const data = await res.json();
        if (data.success) {
          setCount(data.users.length); // ✅ just count
        }
      } catch (err) {
        console.error("Failed to fetch online users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineUsers();

    // Auto-refresh every 30s
    const interval = setInterval(fetchOnlineUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24 w-48">
        <Loader />  {/* ✅ use Loader component */}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-2xl shadow text-center w-48">
      <h2 className="text-lg font-semibold">👥 Online Users</h2>
      <p className="text-3xl font-bold text-green-600">{count}</p>
    </div>
  );
}
