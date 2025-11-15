import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Blog from "../../../models/Blog";

export async function GET() {
    try {
        await dbConnect();
        const categories = await Blog.distinct("category");
        return NextResponse.json({ success: true, categories });
    } catch (err) {
        console.error("Category fetch error:", err);
        return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
    }
}
    