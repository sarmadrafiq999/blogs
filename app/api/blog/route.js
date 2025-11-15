import { NextResponse } from "next/server";
import Blog from "../../../models/Blog";
import dbConnect from "../../../lib/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log("Incoming Blog Data:", body); // ✅ Add this

    const blog = await Blog.create(body);
    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (err) {
    console.error("Blog creation error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to create blog post",
      },
      { status: 400 }
    );
  }

}

export async function GET() {
  try {
    await dbConnect();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, blogs });
  } catch (err) {
    console.error("Fetch blogs error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
