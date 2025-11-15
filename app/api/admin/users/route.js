// app/api/admin/users/route.js
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";
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

// ✅ GET all users (Admin only)
export async function GET(req) {
  try {
    // 🔒 Admin check
    const authCheck = await checkAdmin(req);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const users = await clerkClient.users.getUserList({ limit: 100 });
    const formatted = users.map((u) => ({
      id: u.id,
      fullName: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
      email: u.emailAddresses[0]?.emailAddress || null,
      imageUrl: u.imageUrl,
      role: u.publicMetadata?.role || "user",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
