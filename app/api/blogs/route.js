import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Blog from "../../../models/Blog";
import cloudinary from "../../../lib/cloudinary"; // your cloudinary config

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category");
    const authorId = formData.get("authorId");
    const authorName = formData.get("authorName") || "Anonymous";

    let images = [];
    const file = formData.get("file");

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "blogs" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      images.push(uploadResult.secure_url);
    }

    const newBlog = new Blog({
      title,
      content,
      category,
      authorId,
      authorName,
      images,
    });

    await newBlog.save();

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
