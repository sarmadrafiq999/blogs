import { auth } from "@clerk/nextjs/server";
import dbConnect from "../../../../lib/dbConnect";
import Blog from "../../../../models/Blog";
import mongoose from "mongoose";  // Corrected import
import { NextResponse } from "next/server";  // For consistent response handling

export async function POST(req, context) {
  try {
    const { id } =await context.params;
    const { userId } =await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Validate blog ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 });
    }

    const { comment } = await req.json();
    if (!comment?.trim()) {
      return NextResponse.json(
        { message: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Improved username generation
    const userName = `User-${userId.slice(-6)}`; // Last 6 chars of userId

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // Initialize comments array if needed
    if (!Array.isArray(blog.comments)) {
      blog.comments = [];
    }

    blog.comments.push({
      userId,
      userName,
      text: comment.trim(),
      createdAt: new Date(),
    });

    await blog.save();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error saving comment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}