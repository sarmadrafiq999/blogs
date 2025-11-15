// app/api/gallery/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await dbConnect();

    // Fetch blogs with images
    const blogs = await Blog.find({ images: { $exists: true, $ne: [] } }).select("images");

    // Flatten and deduplicate
    const allImageUrls = blogs.flatMap((blog) => blog.images).filter(Boolean);
    const uniqueUrls = [...new Set(allImageUrls)];

    return NextResponse.json({ images: uniqueUrls }, { status: 200 });
  } catch (err) {
    console.error("Gallery API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch gallery images", details: err.message },
      { status: 500 }
    );
  }
}
