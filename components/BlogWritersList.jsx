"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Tittle from "./Tittle";
import Loader from "./Loader";

export default function BlogWritersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Fetch all writers
  useEffect(() => {
    fetch("/api/admin/blogwriters")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch(() => toast.error("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  // Filter users whenever search input changes
  useEffect(() => {
    const query = search.toLowerCase();
    const filtered = users.filter(
      (user) =>
        (user.fullName && user.fullName.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query))
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const goToUserPage = (userId) => {
    router.push(`/admin/user/${userId}`);
  };

  return (
    <div className="p-8 mt-6 min-h-screen">
      <div className="flex justify-center mb-6">
        <Tittle text1={"All"} text2={"BlogWriters"} />
      </div>

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
                className="relative p-6 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => goToUserPage(user.id)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {user.fullName ? user.fullName.charAt(0) : "U"}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.fullName || "No Name"}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">ID: {user.id}</p>
                <div className="absolute top-4 right-4 text-gray-300 group-hover:text-indigo-500 transition-colors">
                  &rarr;
                </div>
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
