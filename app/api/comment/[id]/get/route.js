import dbConnect from "../../../../../lib/dbConnect";
import Blog from "../../../../../models/Blog";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function GET(_, context) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 });
  }

  await dbConnect();

  const blog = await Blog.findById(id).select("comments");
  if (!blog) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }

  const commentsWithUser = await Promise.all(
    blog.comments.map(async (comment) => {
      let userName = "Anonymous";

      if (comment.userId) {
        try {
          const user = await clerkClient.users.getUser(comment.userId);
          userName =
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.username ||
            "Unknown";
        } catch (err) {
          console.warn("⚠️ Failed to fetch user info for:", comment.userId);
        }
      }

      return {
        text: comment.text,
        userName,
        createdAt: comment.createdAt,
      };
    })
  );

  return NextResponse.json({ comments: commentsWithUser }, { status: 200 });
}
