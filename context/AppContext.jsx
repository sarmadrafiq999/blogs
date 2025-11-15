"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);

  // New: interaction state
  const [blogInteractions, setBlogInteractions] = useState({});

  // Load all blogs initially
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/bloglist");
        const data = await res.json();
        setBlogData(data.blogs || []);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // New: fetch likes/dislikes for a blog
  const fetchBlogInteractions = async (blogId) => {
    try {
      const res = await fetch(`/api/blog/${blogId}`);
      const data = await res.json();

      setBlogInteractions((prev) => ({
        ...prev,
        [blogId]: {
          likes: data.likes || [],
          dislikes: data.dislikes || [],
        },
      }));
    } catch (err) {
      console.error("Failed to fetch blog interactions:", err);
    }
  };

  // New: toggle like
  const toggleLike = async (blogId) => {
    try {
      const res = await fetch(`/api/like/${blogId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      // Update local interaction state
      setBlogInteractions((prev) => ({
        ...prev,
        [blogId]: {
          ...prev[blogId],
          likes: data.likes || [],
        },
      }));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // New: toggle dislike
  const toggleDislike = async (blogId) => {
    try {
      const res = await fetch(`/api/dislike/${blogId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      setBlogInteractions((prev) => ({
        ...prev,
        [blogId]: {
          ...prev[blogId],
          dislikes: data.dislikes || [],
        },
      }));
    } catch (err) {
      console.error("Error toggling dislike:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        blogData,
        setBlogData,
        loading,
        blogInteractions,
        fetchBlogInteractions,
        toggleLike,
        toggleDislike,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
