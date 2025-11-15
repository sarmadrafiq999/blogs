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

  // Filter by search (name or email)
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

  // Delete Clerk user
  const deleteUser = async (userId) => {
    // if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
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
    <div className="p-8 mt-20 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">All Clerk Users</h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
        <Loader/>
        </div>
      ) : (
        // Users List
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="relative p-6 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={user.imageUrl}
                    alt={user.fullName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.fullName || "No Name"}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">ID: {user.id}</p>

                {/* Delete Button */}
                <button
                  onClick={() => deleteUser(user.id)}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full mt-10">
              No users found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
