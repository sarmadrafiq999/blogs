// app/api/new-img/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Pollinations API - Generate 3 AI Images
    const images = [1, 2, 3].map(
      (i) => `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${i}`
    );

    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    console.error("Error generating images:", error);
    return NextResponse.json(
      { error: "Failed to generate images" },
      { status: 500 }
    );
  }
}
