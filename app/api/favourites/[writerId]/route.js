import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "../../../../lib/dbConnect";
import Favourite from "../../../../models/Favourite";
import { NextResponse } from "next/server";

// ✅ Remove a writer from favourites
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    // ✅ No need to await getAuth
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Access params correctly
    const writerId = params.writerId;
    if (!writerId) {
      return NextResponse.json(
        { error: "writerId is required" },
        { status: 400 }
      );
    }

    // ✅ Delete favourite for this user/writer
    const deleted = await Favourite.findOneAndDelete({ userId, writerId });

    if (!deleted) {
      return NextResponse.json(
        { message: "Writer not found in favourites" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Writer removed from favourites" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error removing favourite:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
