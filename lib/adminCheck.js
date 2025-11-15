import { clerkClient } from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function verifyAdminAPI(req) {
  const { userId } = await getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized - no userId" }, { status: 401 });
  }

  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata?.role || "user";

  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized - only admin allowed" }, { status: 403 });
  }

  return null; // ✅ means admin verified
}
