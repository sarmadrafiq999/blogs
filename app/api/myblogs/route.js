// app/api/myblogs/route.js
import { auth } from "@clerk/nextjs/server"; // ✅ Correct for App Router
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const blogs = await Blog.find({ authorId: userId }).sort({ createdAt: -1 });

  return NextResponse.json({ success: true, blogs });
}
