import { getAuth } from "@clerk/nextjs/server"; // use getAuth from nextjs
import { clerkClient } from "@clerk/clerk-sdk-node"; // use Node SDK for user details
import dbConnect from "../../../lib/dbConnect";
import Favourite from "../../../models/Favourite";
import { NextResponse } from "next/server";

// Add writer to favourites
export async function POST(req) {
  try {
    await dbConnect();

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { writerId } = await req.json();
    if (!writerId) {
      return NextResponse.json({ error: "writerId is required" }, { status: 400 });
    }

    const exists = await Favourite.findOne({ userId, writerId });
    if (exists) {
      return NextResponse.json(
        { message: "Already favourited", favourite: exists },
        { status: 200 }
      );
    }

    // Fetch writer details using Node SDK
    const writer = await clerkClient.users.getUser(writerId);
    if (!writer) {
      return NextResponse.json({ error: "Writer not found" }, { status: 404 });
    }

    const fav = await Favourite.create({
      userId,
      writerId,
      writerName: `${writer.firstName || ""} ${writer.lastName || ""}`.trim(),
      writerEmail: writer.emailAddresses?.[0]?.emailAddress || "",
      writerImage: writer.imageUrl || "",
    });

    return NextResponse.json(
      { message: "Writer added to favourites", favourite: fav },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding favourite:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Get all favourites
export async function GET(req) {
  try {
    await dbConnect();

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favourites = await Favourite.find({ userId }).select(
      "writerId writerName writerEmail writerImage"
    );

    return NextResponse.json({ favourites }, { status: 200 });
  } catch (err) {
    console.error("Error fetching favourites:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
