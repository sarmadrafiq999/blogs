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

  const goToUserPage = (id) => router.push(`/admin/user/${id}`);

  return (
    <div
      className="p-8 mt-16 min-h-screen w-full bg-black bg-gradient-to-b from-black
via-gray-900 to-black text-gray-100"
    >
      {" "}
      {/* Title */}
      <div className="flex justify-center mb-10 mt-10">
        <Tittle text1="All" text2="BlogWriters" />
      </div>
      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-3 bg-white/10 border border-white/20
          text-gray-100 placeholder-gray-400 rounded-2xl
          focus:outline-none focus:ring-2 focus:ring-amber-500 backdrop-blur-xl"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => goToUserPage(user.id)}
                className="relative p-6 bg-white/10 border border-white/20 backdrop-blur-xl
                rounded-2xl shadow-xl cursor-pointer
                hover:shadow-amber-500/20 hover:border-amber-400 hover:scale-[1.04]
                transition-all duration-300"
              >
                {/* User Avatar */}
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-600
                  flex items-center justify-center text-amber-300 font-bold text-lg"
                  >
                    {user.fullName?.charAt(0) || "U"}
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-gray-100">
                      {user.fullName || "No Name"}
                    </p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500">ID: {user.id}</p>

                {/* Arrow */}
                <div className="absolute top-5 right-5 text-gray-400 transition group-hover:text-amber-400">
                  →
                </div>
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
