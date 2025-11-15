export async function generateBlogWithGemini(title) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Write a detailed blog post about: "${title}". Include introduction, main points, and conclusion.`,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
