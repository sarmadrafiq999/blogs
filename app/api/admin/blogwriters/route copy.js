// app/api/admin/blogwriters/route.js
import dbConnect from "../../../../lib/dbConnect";
import Blog from "../../../../models/Blog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Get unique authors from blogs
    const writers = await Blog.aggregate([
      {
        $group: {
          _id: "$authorId",
          fullName: { $first: "$authorName" },
          blogsCount: { $sum: 1 },
        },
      },
      { $sort: { blogsCount: -1 } },
    ]);

    // Reformat for frontend
    const formatted = writers.map((w) => ({
      id: w._id,
      fullName: w.fullName,
      email: null, // Blog collection doesn’t store email
      blogsCount: w.blogsCount,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch blog writers" },
      { status: 500 }
    );
  }
}
