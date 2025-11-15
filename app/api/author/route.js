import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await clerkClient.users.getUserList(); // Get all users
    const formatted = users.map((user) => ({
      id: user.id,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      emailAddress: user.emailAddresses[0]?.emailAddress || null,
      imageUrl: user.imageUrl,
    }));

    return NextResponse.json({ users: formatted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
