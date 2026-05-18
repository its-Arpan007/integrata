import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { user1Skills, user2Skills, user1Dna, user2Dna } = await request.json();

    // If Gemini API key is available, use it
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const prompt = `Analyze the compatibility between two builders:
User 1 Skills: ${user1Skills?.join(", ")}
User 1 Personality: ${user1Dna?.join(", ")}
User 2 Skills: ${user2Skills?.join(", ")}
User 2 Personality: ${user2Dna?.join(", ")}

Return a JSON object with: overallScore (0-100), dimensions (array of {name, score, description}), strengths (array of strings), challenges (array of strings), aiInsight (string).`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return NextResponse.json(JSON.parse(text));
        }
      }
    }

    // Fallback mock response
    return NextResponse.json({
      overallScore: 91,
      dimensions: [
        { name: "Technical Synergy", score: 92, description: "Skills complement each other extremely well" },
        { name: "Work Style", score: 87, description: "Similar pacing with complementary approaches" },
        { name: "Communication", score: 94, description: "Both value clear, async-first communication" },
        { name: "Goal Alignment", score: 89, description: "Shared ambition for impactful projects" },
        { name: "Creative Energy", score: 96, description: "High creative compatibility and idea synergy" },
      ],
      strengths: [
        "Both thrive in fast-paced environments",
        "Complementary skill sets cover full product spectrum",
        "Shared passion for AI-driven products",
      ],
      challenges: [
        "Both tend toward night-owl schedules",
        "May need clear ownership boundaries",
      ],
      aiInsight: "This is a high-potential collaboration pairing with excellent synergy.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate compatibility" }, { status: 500 });
  }
}
