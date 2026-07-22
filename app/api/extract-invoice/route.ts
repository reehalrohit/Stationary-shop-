import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the uploaded file into a Base64 string
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // The strict prompt forcing the AI to act as a structured data extractor
    const prompt = `
      You are an expert OCR system for a stationary shop. Analyze this supplier invoice image.
      Extract the items purchased and return ONLY a valid JSON array of objects.
      Do not use markdown blocks, backticks, or extra text.
      Each object must strictly have these keys:
      - "name" (string): The name of the stationary item.
      - "qty" (number): The quantity received.
      - "price" (number): The unit price of the item.
    `;

    // Call OpenRouter API directly using standard fetch
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://stationary-shop-taupe.vercel.app", 
        "X-Title": "Stationary Shop POS"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", // Routing to Google's state-of-the-art vision model via OpenRouter
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${file.type};base64,${base64Image}`
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", errorText);
        throw new Error("Failed to communicate with OpenRouter");
    }

    const result = await response.json();
    const textResponse = result.choices[0].message.content;
    
    // Clean up the response in case the AI accidentally added markdown
    const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const extractedData = JSON.parse(cleanedText);

    return NextResponse.json({ items: extractedData });

  } catch (error) {
    console.error('AI Extraction Failed:', error);
    return NextResponse.json({ error: 'Failed to process invoice' }, { status: 500 });
  }
}
