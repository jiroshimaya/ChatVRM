import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { text, voice = 'alloy' } = await req.json();

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice,
      input: text,
    });

    return new Response(await mp3.arrayBuffer(), {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('OpenAI TTS API error:', error);
    return new Response(
      JSON.stringify({ message: 'OpenAI TTS APIでエラーが発生しました' }),
      { status: 500 }
    );
  }
} 