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

// ✅ DELETE all blogs by user (Admin only)
export async function DELETE(req, { params }) {
  try {
    // 🔒 Admin check
    const authCheck = await checkAdmin(req);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const { userId } =await params;
    await dbConnect();

    const result = await Blog.deleteMany({ authorId: userId });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} blog(s) from user ${userId}`,
    });
  } catch (err) {
    console.error("Admin Delete User Blogs Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete all blogs" },
      { status: 500 }
    );
  }
}
