import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { user1Name, user2Name, sharedInterests } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const prompt = `Generate 3 short, friendly icebreaker messages for ${user1Name} to send to ${user2Name}. They share interests in: ${sharedInterests?.join(", ")}. Keep each message under 150 characters, casual and enthusiastic.`;

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
      icebreakers: [
        `Hey ${user2Name}! I noticed we both love ${sharedInterests?.[0] || "building"}. Want to team up for an upcoming hackathon?`,
        `Your builder DNA is awesome — I think we'd ship really fast together. Got any projects in mind?`,
        `Love your profile! I think our vibes would mesh well on a project. What are you working on?`,
      ],
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate icebreakers" }, { status: 500 });
  }
}
