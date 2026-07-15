import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const apiKey = process.env.OPENAI_API_KEY || '';

export async function POST(req) {
  try {
    const { pdfText } = await req.json();

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API Key eksik." }), { status: 400 });
    }

    if (!pdfText || pdfText.length < 10) {
      return new Response(JSON.stringify({ error: "Özetlenecek yeterli metin bulunamadı." }), { status: 400 });
    }

    const prompt = `
Aşağıda verilen metni profesyonel bir şekilde analiz et ve özetle.
Eğer çok uzunsa ana başlıklar (bullet points) halinde en önemli noktaları çıkar.
Dil kesinlikle Türkçe olmalıdır.

Metin:
${pdfText.substring(0, 15000)} // GPT modelinin token sınırını aşmaması için ilk 15000 karakter
    `;

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      prompt: prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("AI Summarize Error:", error);
    return new Response(JSON.stringify({ error: "Özetleme yapılamadı." }), { status: 500 });
  }
}
