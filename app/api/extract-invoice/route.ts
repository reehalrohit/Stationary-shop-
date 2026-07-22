export const maxDuration = 60;
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // Streamlined prompt for faster processing on free models
    const prompt = `
      Analyze this invoice image. Extract all items into a strict JSON array of objects.
      Each object must have: "name" (string), "qty" (number), "price" (number).
      Return ONLY the raw JSON array. No extra text.
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://stationary-shop-taupe.vercel.app", 
        "X-Title": "Ajay Stationary Hub POS"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${file.type};base64,${base64Image}` } }
            ]
          }
        ]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      return NextResponse.json({ error: `AI provider is busy (Status ${response.status}). Please try again.` }, { status: response.status });
    }

    const result = await response.json();
    
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      return NextResponse.json({ error: 'Invalid response from AI provider' }, { status: 500 });
    }

    const textResponse = result.choices[0].message.content;
    const jsonMatch = textResponse.match(/\[[\s\S]*\]/) || textResponse.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return NextResponse.json({ error: 'AI response did not contain a valid JSON list' }, { status: 500 });
    }

    const extractedData = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ items: extractedData });

  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'The AI request timed out because free servers are busy. Please tap Extract Items again.' }, { status: 504 });
    }
    console.error('AI Extraction Failed:', error);
    return NextResponse.json({ error: error.message || 'Failed to process invoice' }, { status: 500 });
  }
}
  
