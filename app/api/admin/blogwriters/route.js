// app/api/admin/blogwriters/route.js
import { verifyAdminAPI } from "../../../../lib/adminCheck";
import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Blog from "../../../../models/Blog";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const runtime = "nodejs";

// ✅ GET all blog writers (Admin only)
export async function GET(req) {
  try {
    // 🔒 Step 1: Admin authentication
    const notAdmin = await verifyAdminAPI(req);
    if (notAdmin) return notAdmin; // If not admin, return error immediately

    // Step 2: Database connection
    await dbConnect();

    // Step 3: Get all distinct authors from Blog collection
    const writers = await Blog.distinct("authorId");
    console.log("Writer IDs from DB:", writers);

    if (writers.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Step 4: Fetch Clerk user info for each writer
    const writerData = await Promise.all(
      writers.map(async (id) => {
        try {
          const user = await clerkClient.users.getUser(id);

          return {
            id: user.id,
            email: user.emailAddresses?.[0]?.emailAddress || null,
            fullName:
              user.fullName ||
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.username ||
              user.emailAddresses?.[0]?.emailAddress ||
              "Unknown",
          };
        } catch (err) {
          console.error("Failed to fetch Clerk user for:", id, err.message);
          return { id, email: null, fullName: "Unknown" };
        }
      })
    );

    // Step 5: Return response
    return NextResponse.json(writerData, { status: 200 });
  } catch (err) {
    console.error("Error in /api/admin/blogwriters:", err);
    return NextResponse.json(
      { error: "Failed to fetch blog writers" },
      { status: 500 }
    );
  }
}
