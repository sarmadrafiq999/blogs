// app/api/admin/blogs/route.js
import dbConnect from "../../../../lib/dbConnect";
import Blog from "../../../../models/Blog";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

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

// ✅ GET all blogs (Admin only)
export async function GET(request) {
  try {
    const authCheck = await checkAdmin(request);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    await dbConnect();

    const url = new URL(request.url);
    const userIdFilter = url.searchParams.get("userId");
    const authorName = url.searchParams.get("authorName");

    let query = {};
    if (userIdFilter) query.authorId = userIdFilter;
    if (authorName) query.authorName = { $regex: new RegExp(authorName, "i") };

    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    const formattedBlogs = blogs.map((b) => ({
      ...b._doc,
      _id: b._id.toString(),
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, blogs: formattedBlogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE blogs (Admin only)
export async function DELETE(request) {
  try {
    const authCheck = await checkAdmin(request);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    await dbConnect();

    const url = new URL(request.url);
    const filterUserId = url.searchParams.get("userId");
    const authorName = url.searchParams.get("authorName");

    let filter = {};
    if (filterUserId) filter.authorId = filterUserId;
    if (authorName) filter.authorName = { $regex: authorName, $options: "i" };

    const result = await Blog.deleteMany(filter);

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} blog(s)`,
    });
  } catch (error) {
    console.error("Error deleting blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blogs", details: error.message },
      { status: 500 }
    );
  }
}
