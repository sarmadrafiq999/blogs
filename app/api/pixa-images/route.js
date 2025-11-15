export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title } = await req.json();

    if (!process.env.PIXABAY_API_KEY) {
      return NextResponse.json({ message: "Missing Pixabay API key" }, { status: 500 });
    }

    if (!title?.trim()) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    // Fetch 5 images
    const searchRes = await fetch(
      `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(
        title
      )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=5&page=1`
    );

    const data = await searchRes.json();

    const imageUrls =
      data.hits?.slice(0, 5).map((hit, idx) => hit.webformatURL) ||
      Array.from({ length: 5 }, (_, idx) => `https://placehold.co/600x400?text=Image+${idx + 1}`);

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error("Pixabay image fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


