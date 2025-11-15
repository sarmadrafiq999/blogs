import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Blog from "../../../models/Blog";

export async function POST(req) {
  try {
    const { title, content, images, authorId, authorName } = await req.json();

    // Validate
    if (!title || !content || !authorId) {
      return NextResponse.json(
        { message: "Title, content, and author ID are required" },
        { status: 400 }
      );
    }

    // Connect to DB
    await dbConnect();

    // Save blog
    const newBlog = new Blog({
      title,
      content,
      images: images || [],
      authorId,
      authorName: authorName || "Anonymous",
    });

    await newBlog.save();

    return NextResponse.json({ message: "Blog saved successfully", blog: newBlog }, { status: 201 });
  } catch (error) {
    console.error("Failed to save blog:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
