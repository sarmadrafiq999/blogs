// app/api/bloglist/writer/[authorId]/route.js
import dbConnect from "../../../../../lib/dbConnect";
import Blog from "../../../../../models/Blog";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // First destructure the params
    const { authorId } =await params;
    const { userId } = await getAuth(request);

    // Verify the requesting user matches the author
    if (userId !== authorId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    await dbConnect();
    const blogs = await Blog.find({ authorId })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      blogs,
      count: blogs.length
    });

  } catch (error) {
    console.error("Error fetching writer blogs:", {
      error: error.message,
      stack: error.stack
    });
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