  import { clerkClient } from "@clerk/clerk-sdk-node";
  import { NextResponse } from "next/server";

  export async function GET(req, { params }) {
    try {
      const { id } =await params; // no await
      const user = await clerkClient.users.getUser(id);

      return NextResponse.json({
        id: user.id,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        emailAddress: user.emailAddresses[0]?.emailAddress || null,
        imageUrl: user.imageUrl,
      });
    } catch (error) {
      console.error("Error fetching author:", error);
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }
  }
