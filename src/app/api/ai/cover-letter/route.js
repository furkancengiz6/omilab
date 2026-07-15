import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// API Key yoksa hata vermemesi için
const apiKey = process.env.OPENAI_API_KEY || '';

export async function POST(req) {
  try {
    const { cvText, jobDescription } = await req.json();

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API Key eksik. Lütfen .env.local dosyasına OPENAI_API_KEY ekleyin." }), { status: 400 });
    }

    const prompt = `
Aşağıdaki bilgilere dayanarak profesyonel bir Ön Yazı (Cover Letter) oluştur.

Kullanıcının CV/Yetenek Özeti:
${cvText}

Başvurulan İş İlanı Detayları:
${jobDescription}

Lütfen ikna edici, iş ilanındaki anahtar kelimeleri içeren ve çok uzun olmayan bir dille yaz. Dil Türkçe olmalıdır.
    `;

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      prompt: prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ error: "Yapay zeka ile iletişim kurulamadı." }), { status: 500 });
  }
}
