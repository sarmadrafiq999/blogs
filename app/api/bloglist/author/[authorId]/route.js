// app/api/bloglist/author/[authorId]/route.js
import dbConnect from "../../../../../lib/dbConnect";
import Blog from "../../../../../models/Blog";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { authorId } =await params;

    // Decode URI component if needed
    const decodedAuthorId = decodeURIComponent(authorId);

    // Search by authorId or authorName (case insensitive)
    const blogs = await Blog.find({
      $or: [
        { authorId: decodedAuthorId },
        { authorName: { $regex: new RegExp(decodedAuthorId, 'i') } }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      blogs,
      count: blogs.length,
      authorName: blogs[0]?.authorName || decodedAuthorId
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blogs",
        message: error.message
      },
      { status: 500 }
    );
  }
}