"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Loader from "./Loader";

export default function ClerkUsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch Clerk users
  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch(() => toast.error("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  // Filter by search
  useEffect(() => {
    const query = search.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          (u.fullName && u.fullName.toLowerCase().includes(query)) ||
          (u.email && u.email.toLowerCase().includes(query))
      )
    );
  }, [search, users]);

  // Delete user
  const deleteUser = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setUsers(users.filter((u) => u.id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error(data.error || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
   <div className="p-8 mt-20 min-h-screen w-full
bg-gradient-to-b from-black via-gray-900 to-black text-gray-100">

  {/* Page Title */}
  <h2 className="text-3xl font-extrabold text-center mb-10 tracking-wide
  text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400">
    All Clerk Users
  </h2>

  {/* Search Bar */}
  <div className="flex justify-center mb-10">
    <input
      type="text"
      placeholder="Search by name or email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full sm:w-1/2 px-4 py-3 rounded-2xl
      bg-black/40 backdrop-blur-xl
      text-gray-100 placeholder-gray-400
      border border-gray-700
      focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Loader */}
  {loading ? (
    <div className="flex justify-center items-center h-64">
      <Loader />
    </div>
  ) : (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
    >
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative p-6
            bg-white/5 backdrop-blur-2xl
            border border-white/10
            rounded-2xl shadow-xl
            hover:shadow-purple-500/30 hover:border-purple-400
            transition-all duration-300"
          >
            {/* User Card */}
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={user.imageUrl}
                alt={user.fullName}
                className="w-14 h-14 rounded-full border border-purple-400/40"
              />
              <div>
                <p className="text-lg font-semibold text-gray-100">
                  {user.fullName || "No Name"}
                </p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>

            <p className="text-xs text-gray-500">User ID: {user.id}</p>

            {/* Delete Button */}
            <button
              onClick={() => deleteUser(user.id)}
              className="absolute top-4 right-4
              bg-red-600/80 hover:bg-red-700
              text-white text-xs px-3 py-1 rounded-lg shadow-md transition"
            >
              Delete
            </button>
          </motion.div>
        ))
      ) : (
        <p className="text-center text-gray-400 col-span-full mt-10">
          No users found.
        </p>
      )}
    </motion.div>
  )}
</div>

  );
}
