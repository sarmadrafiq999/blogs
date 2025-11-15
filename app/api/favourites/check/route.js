import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "../../../../lib/dbConnect";
import Favourite from "../../../../models/Favourite";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    const { searchParams } = new URL(req.url);
    const writerId = searchParams.get("writerId");

    if (!userId || !writerId) {
      return NextResponse.json({ isFavourite: false });
    }

    await connectDB();

    const fav = await Favourite.findOne({ userId, writerId });

    return NextResponse.json({ isFavourite: !!fav });
  } catch (err) {
    console.error("❌ Error checking favourite:", err);
    return NextResponse.json({ isFavourite: false });
  }
}
