// // app/api/new-img/route.js
// export const runtime = "nodejs";
// import { NextResponse } from "next/server";

// // Inject Cloudinary URLs into markdown
// function injectImagesIntoMarkdown(content, imageUrls) {
//   const paragraphs = content.split("\n\n");
//   if (imageUrls[0]) paragraphs.splice(1, 0, `![Blog Image 1](${imageUrls[0]})`);
//   if (imageUrls[1]) paragraphs.splice(4, 0, `![Blog Image 2](${imageUrls[1]})`);
//   if (imageUrls[2]) paragraphs.push(`![Blog Image 3](${imageUrls[2]})`);
//   return paragraphs.join("\n\n");
// }

// // Delay helper for retry logic
// function delay(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// // Retry Gemini content generation
// async function generateBlogWithRetry(title, retries = 3) {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     const res = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
//         process.env.GEMINI_API_KEY,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `Write a detailed, markdown-formatted blog post about: "${title}". Include a heading, subheadings, bullet points, and conclusion.`,
//                 },
//               ],
//             },
//           ],
//         }),
//       }
//     );

//     const data = await res.json();
//     console.log(`📦 Gemini attempt ${attempt}:`, JSON.stringify(data, null, 2));

//     if (!data.error) return data;
//     if (data.error.code === 503 && attempt < retries) {
//       console.warn(`⚠ Gemini overloaded, retrying... (Attempt ${attempt})`);
//       await delay(2000);
//       continue;
//     }
//     return data;
//   }
// }

// // Upload a single Pollinations image URL to Cloudinary
// async function uploadToCloudinary(imageUrl) {
//   try {
//     const res = await fetch(imageUrl);
//     const buffer = await res.arrayBuffer();

//     const formData = new FormData();
//     formData.append("file", new Blob([buffer]), "image.jpg");
//     formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

//     const cloudinaryRes = await fetch(
//       `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const cloudinaryData = await cloudinaryRes.json();
//     return cloudinaryData.secure_url || imageUrl;
//   } catch (err) {
//     console.error("Cloudinary upload error:", err);
//     return imageUrl; // fallback to Pollinations link
//   }
// }

// export async function POST(req) {
//   try {
//     const { title } = await req.json();

//     if (!process.env.GEMINI_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
//       return NextResponse.json(
//         { message: "Missing API keys" },
//         { status: 500 }
//       );
//     }

//     if (!title?.trim()) {
//       return NextResponse.json(
//         { message: "Title is required" },
//         { status: 400 }
//       );
//     }

//     // Step 1: Generate blog content
//     const geminiData = await generateBlogWithRetry(title);
//     const rawContent =
//       geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

//     if (!rawContent) {
//       return NextResponse.json(
//         { message: geminiData.error?.message || "Gemini returned empty content" },
//         { status: 500 }
//       );
//     }

//     // Step 2: Generate AI images with Pollinations
//     const searchQuery = title.replace(/[^a-zA-Z0-9 ]/g, "");
//     const pollinationsUrls = [1, 2, 3].map(
//       (i) =>
//         `https://image.pollinations.ai/prompt/${encodeURIComponent(
//           searchQuery
//         )}?seed=${i}`
//     );

//     // Step 3: Upload to Cloudinary
//     const cloudinaryUrls = await Promise.all(
//       pollinationsUrls.map((url) => uploadToCloudinary(url))
//     );
//     console.log("✅ Final Cloudinary URLs:", cloudinaryUrls);

//     // Step 4: Inject Cloudinary URLs into blog content
//     const finalContent = injectImagesIntoMarkdown(rawContent, cloudinaryUrls);

//     return NextResponse.json(
//       { output: finalContent, imageUrls: cloudinaryUrls },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("💥 Error generating blog:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// app/api/new-img/route.js
export const runtime = "nodejs";
import { NextResponse } from "next/server";

// --- Inject Cloudinary URLs into markdown ---
function injectImagesIntoMarkdown(content, imageUrls) {
  const paragraphs = content.split("\n\n");
  if (imageUrls[0]) paragraphs.splice(1, 0, `![Blog Image 1](${imageUrls[0]})`);
  if (imageUrls[1]) paragraphs.splice(4, 0, `![Blog Image 2](${imageUrls[1]})`);
  if (imageUrls[2]) paragraphs.push(`![Blog Image 3](${imageUrls[2]})`);
  return paragraphs.join("\n\n");
}

// --- Delay helper ---
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Retry Gemini content generation ---
async function generateBlogWithRetry(title, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
      + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a detailed, markdown-formatted blog post about: "${title}". Include a heading, subheadings, bullet points, and conclusion.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();
    console.log(`📦 Gemini attempt ${attempt}:`, JSON.stringify(data, null, 2));

    if (!data.error) return data;
    if (data.error.code === 503 && attempt < retries) {
      console.warn(`⚠ Gemini overloaded, retrying... (Attempt ${attempt})`);
      await delay(2000);
      continue;
    }
    return data;
  }
}

// --- Upload Pollinations image to Cloudinary ---
async function uploadToCloudinary(imageUrl) {
  try {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();

    const formData = new FormData();
    formData.append("file", new Blob([buffer]), "image.jpg");
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const cloudinaryData = await cloudinaryRes.json();
    return cloudinaryData.secure_url || imageUrl;
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err);
    return imageUrl; // fallback
  }
}

// --- Main POST handler ---
export async function POST(req) {
  try {
    const { title } = await req.json();

    if (!process.env.GEMINI_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json(
        { message: "Missing API keys" },
        { status: 500 }
      );
    }

    if (!title?.trim()) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    // Step 1: Generate blog content
    const geminiData = await generateBlogWithRetry(title);
    const rawContent =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!rawContent) {
      return NextResponse.json(
        {
          message: geminiData.error?.message || "Gemini returned empty content",
        },
        { status: 500 }
      );
    }

    // Step 2: Generate AI images with Pollinations
    const searchQuery = title.replace(/[^a-zA-Z0-9 ]/g, "");
    const pollinationsUrls = [1, 2, 3].map(
      (i) =>
        `https://image.pollinations.ai/prompt/${encodeURIComponent(
          searchQuery
        )}?seed=${i}`
    );

    // Step 3: Upload to Cloudinary
    const cloudinaryUrls = await Promise.all(
      pollinationsUrls.map((url) => uploadToCloudinary(url))
    );
    console.log("✅ Final Cloudinary URLs:", cloudinaryUrls);

    // Step 4: Inject Cloudinary URLs into blog content
    const finalContent = injectImagesIntoMarkdown(rawContent, cloudinaryUrls);

    // ✅ Step 5: Return (ready to store in MongoDB)
    return NextResponse.json(
      {
        output: finalContent, // frontend expects this
        imageUrls: cloudinaryUrls, // frontend expects this
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("💥 Error generating blog:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
