// app/api/admin/users/[userId]/route.js
import Blog from "../../../../../models/Blog";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import dbConnect from "../../../../../lib/dbConnect";
import { getAuth } from "@clerk/nextjs/server";

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

export async function DELETE(req, { params }) {
  try {
    // 🔒 Admin-only access
    const authCheck = await checkAdmin(req);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // ✅ DB connection
    await dbConnect();

    // ✅ Delete user from Clerk
    await clerkClient.users.deleteUser(userId);

    // ✅ Delete all blogs by this author
    await Blog.deleteMany({ authorId: userId });

    return NextResponse.json({
      success: true,
      message: "User and their blogs deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
