import dbConnect from "../../../../lib/dbConnect";
import Blog from "../../../../models/Blog";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { id } = await context.params; // ✅ Await this

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 });
    }

    await dbConnect();

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
