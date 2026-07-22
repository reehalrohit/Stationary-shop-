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

    const prompt = `
      You are an expert OCR system for a stationary shop. Analyze this supplier invoice image.
      Extract the items purchased and return ONLY a valid JSON array of objects.
      Do not use markdown blocks, backticks, or extra text.
      Each object must strictly have these keys:
      - "name" (string): The name of the stationary item.
      - "qty" (number): The quantity received.
      - "price" (number): The unit price of the item.
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://stationary-shop-taupe.vercel.app", 
        "X-Title": "Stationary Shop POS"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001", // The correct, valid model name!
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${file.type};base64,${base64Image}` } }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", errorText);
        // This will now send the EXACT error back to your frontend
        return NextResponse.json({ error: `OpenRouter Error: ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();
    
    // Check if OpenRouter returned a valid message
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      console.error("Unexpected API Response:", result);
      return NextResponse.json({ error: 'Invalid response from AI provider' }, { status: 500 });
    }

    const textResponse = result.choices[0].message.content;
    const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const extractedData = JSON.parse(cleanedText);

    return NextResponse.json({ items: extractedData });

  } catch (error: any) {
    console.error('AI Extraction Failed:', error);
    return NextResponse.json({ error: error.message || 'Failed to process invoice' }, { status: 500 });
  }
}
  
