export async function POST(req) {
    const { userInput } = await req.json();

    console.log("🚀 Incoming userInput:", userInput);

    const prompt = `
    Suggest 10 catchy blog titles (3–6 words) for the topic:
    "${userInput}"
    - Keep them short and interesting
    - No numbering if possible
    - Return only the titles, each on a new line
    `;

    const models = [
        "huggingfaceh4/zephyr-7b-beta:free", // ✅ primary
        "mistralai/mistral-7b-instruct:free"  // ✅ fallback
    ];

    for (const model of models) {
        try {
            console.log(`⚙️ Trying model: ${model}`);
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: "system", content: "You are an AI assistant that writes creative and concise blog titles." },
                        { role: "user", content: prompt },
                    ],
                    max_tokens: 300, // ✅ Increased for complete output
                }),
            });

            const json = await response.json();
            console.log("🧠 AI Raw Response:", JSON.stringify(json));

            const suggestions = json.choices?.[0]?.message?.content
                ?.split("\n")
                .map(t => t.replace(/^\d+[\.\)]?\s*/, "").trim())
                .filter(Boolean);

            if (suggestions && suggestions.length > 0) {
                console.log("🎯 Cleaned Suggestions:", suggestions);
                return Response.json({ suggestions });
            }
        } catch (err) {
            console.error(`❌ Error with model ${model}:`, err);
        }
    }

    // If all models fail
    return Response.json({ suggestions: [], error: "All models failed to return suggestions." }, { status: 500 });
}
