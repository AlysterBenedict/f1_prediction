import { NextResponse } from 'next/server';

// This is the URL where your LM Studio server is running
// As seen in your screenshot, it's http://localhost:1234
const LM_STUDIO_URL = 'http://localhost:1234/v1/chat/completions';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      );
    }

    // This prompt guides the AI to be an F1 expert.
    const systemPrompt =
      "You are an expert on Formula 1 (F1) history. Answer the user's questions about F1 seasons, race winners, driver championships, constructor scores, and other related trivia. Be concise and accurate.";

    // Format the request for the OpenAI-compatible LM Studio API
    const requestBody = {
      // NOTE: Your image shows 'gemma-2-9b-it'. 
      // Replace this if you are using a different model file.
      model: 'gemma-2-9b-it',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      stream: false, // We'll keep it simple with non-streaming for now
    };

    // Send the request to LM Studio
    const lmStudioResponse = await fetch(LM_STUDIO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!lmStudioResponse.ok) {
      throw new Error(
        `LM Studio API request failed with status ${lmStudioResponse.status}`
      );
    }

    const data = await lmStudioResponse.json();
    const aiReply = data.choices[0].message.content;

    // Send the AI's reply back to the frontend
    return NextResponse.json({ reply: aiReply });
  } catch (error) {
    console.error('API chat error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}