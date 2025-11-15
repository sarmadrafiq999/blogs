// app/api/bloglist/[blogId]/route.js
import dbConnect from "../../../../lib/dbConnect";
import Blog from "../../../../models/Blog";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

// GET a single blog
export async function GET(request, { params }) {
  try {
    const { blogId } =await params;
    const { userId } = getAuth(request);

    await dbConnect();
    const blog = await Blog.findById(blogId);

    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    // --- ADD AUTHORIZATION CHECK ---
    if (blog.authorId !== userId) {
      const user = userId ? await clerkClient.users.getUser(userId) : null;
      const role = user?.publicMetadata?.role || "user";
      if (role !== "admin") {
        return NextResponse.json(
          { error: "Unauthorized - you cannot access this blog" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      blog: {
        ...blog._doc,
        _id: blog._id.toString(),
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog", details: error.message },
      { status: 500 }
    );
  }
}


// UPDATE a blog (author or admin)
export async function PUT(request, { params }) {
    try {
        const { blogId } = await params;
        const { userId } = getAuth(request);

        const { title, content, images, category } = await request.json();

        await dbConnect();

        const blog = await Blog.findById(blogId);
        if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

        // Check if user is admin
        const user = await clerkClient.users.getUser(userId);
        const role = user.publicMetadata?.role || "user";

        if (blog.authorId !== userId && role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized - only author or admin can edit" },
                { status: 403 }
            );
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, content, images, category, updatedAt: new Date() },
            { new: true }
        );

        return NextResponse.json({ success: true, blog: updatedBlog });
    } catch (error) {
        console.error("Error updating blog:", error);
        return NextResponse.json({ error: "Failed to update blog", details: error.message }, { status: 500 });
    }
}

// DELETE a blog (author or admin)
export async function DELETE(request, { params }) {
    try {
        const { blogId } = await params;
        const { userId } = getAuth(request);
        if (!userId) throw new Error("Unauthorized - no userId");


        await dbConnect();
        const blog = await Blog.findById(blogId);
        if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

        const user = await clerkClient.users.getUser(userId);
        const role = user.publicMetadata?.role || "user";

        if (blog.authorId !== userId && role !== "admin") {
            return NextResponse.json({ error: "Failed to delete blog", details: error.message }, { status: 500 });

        }

        await Blog.findByIdAndDelete(blogId);
        return NextResponse.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
    }
}

