// app/api/upload/route.js
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
export const runtime = "nodejs";

export const maxDuration = 300; // allow up to 5 minutes

export const config = {
  api: {
    bodyParser: false, // required for file uploads
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "blog_images", resource_type: "auto" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({ secure_url: uploaded.secure_url });
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json(
      { error: "Upload failed", details: err.message },
      { status: 500 }
    );
  }
}
