// app/api/admin/blogs/user/[userId]/route.js
import dbConnect from "../../../../../../lib/dbConnect";
import Blog from "../../../../../../models/Blog";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

// ✅ Helper: check if current user is admin
async function checkAdmin(request) {
  const { userId } = await getAuth(request);

  if (!userId) {
    return { error: "Unauthorized - no userId", status: 401 };
  }

  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata?.role || "user";

  if (role !== "admin") {
    return { error: "Unauthorized - only admin allowed", status: 403 };
  }

  return { ok: true };
}

// ✅ GET blogs by user (Admin only)
export async function GET(req, { params }) {
  try {
    // 🔒 Admin check
    const authCheck = await checkAdmin(req);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    await dbConnect();
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const blogs = await Blog.find({ authorId: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
