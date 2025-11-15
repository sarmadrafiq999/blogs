import dbConnect from "../../../lib/dbConnect";
import Blog from "../../../models/Blog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Fetch all blogs, sorted by creation date descending
    const blogs = await Blog.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
