import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { teamSkills, interests } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const prompt = `Generate 3 creative startup/project ideas for a team with skills in: ${teamSkills?.join(", ")} and interests in: ${interests?.join(", ")}. Return JSON with array of {title, description, tags}.`;

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

    return NextResponse.json({
      ideas: [
        { title: "AI Code Review Bot", description: "Automated PR reviews using LLMs with context-aware suggestions.", tags: ["AI/ML", "DevOps"] },
        { title: "Smart Documentation Generator", description: "Auto-generate and keep docs in sync with code changes.", tags: ["AI/ML", "Developer Tools"] },
        { title: "Developer Mood Tracker", description: "Track team mood via commit messages for better sprint planning.", tags: ["Data Science", "Backend"] },
      ],
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate ideas" }, { status: 500 });
  }
}
