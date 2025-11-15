// app/api/admin/users/loggedin/route.js
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // Step 1: Get all users
    const users = await clerkClient.users.getUserList({ limit: 100 });

    const loggedInUsers = [];

    // Step 2: Check sessions for each user
    for (const user of users) {
      const sessions = await clerkClient.sessions.getSessionList({
        userId: user.id,
        status: "active",
      });

      if (sessions.length > 0) {
        loggedInUsers.push({
          id: user.id,
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.emailAddresses?.[0]?.emailAddress || null,
          imageUrl: user.imageUrl,
          activeSessions: sessions.length,
        });
      }

      console.log("Sessions for", user.id, sessions); // 👈 Debug log
    }

    return NextResponse.json({
      success: true,
      count: loggedInUsers.length,
      users: loggedInUsers,
    });
  } catch (error) {
    console.error("Error fetching logged-in users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch logged-in users" },
      { status: 500 }
    );
  }
}
