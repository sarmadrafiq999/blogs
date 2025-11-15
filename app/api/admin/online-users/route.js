import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ use default import

// ✅ Helper: check if current user is admin
async function checkAdmin(request) {
  const { userId } = await getAuth(request);
  if (!userId) return { error: "Unauthorized - no userId", status: 401 };

  const user = await clerkClient.users.getUser(userId);
  if (!user) return { error: "User not found", status: 404 };

  if (user.publicMetadata?.role !== "admin") {
    return { error: "Unauthorized - only admin allowed", status: 403 };
  }

  return { ok: true };
}

// ✅ GET online users (last 5 minutes)
export async function GET(req) {
  try {
    const authCheck = await checkAdmin(req);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    // Fetch all users (server SDK automatically uses CLERK_SECRET_KEY)
    const users = await clerkClient.users.getUserList({ limit: 1000 });

    // Count users who signed in within last 5 minutes
    const now = new Date();
    const onlineThreshold = 5 * 60 * 1000;

    const onlineUsers = users.filter(
      u => u.lastSignInAt && now - new Date(u.lastSignInAt) <= onlineThreshold
    );

    return NextResponse.json({ success: true, onlineCount: onlineUsers.length });
  } catch (err) {
    console.error("Error fetching online users:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
