import { auth } from "@clerk/nextjs/server";
import dbConnect from "../../../../lib/dbConnect";
import Blog from "../../../../models/Blog";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  const { id } = await context.params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 });
  }

  await dbConnect();

  const blog = await Blog.findById(id);
  if (!blog) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }

  if (!Array.isArray(blog.dislikes)) blog.dislikes = [];
  if (!Array.isArray(blog.likes)) blog.likes = [];

  let disliked = false;

  const dislikeIndex = blog.dislikes.indexOf(userId);
  const likeIndex = blog.likes.indexOf(userId);

  if (dislikeIndex === -1) {
    blog.dislikes.push(userId);
    disliked = true;
    if (likeIndex !== -1) blog.likes.splice(likeIndex, 1);
  } else {
    blog.dislikes.splice(dislikeIndex, 1);
    disliked = false;
  }

  await blog.save({ validateBeforeSave: false }); // ✅ Skip unnecessary validation

  return NextResponse.json({
    disliked,
    dislikes: blog.dislikes.length,
  });
}
