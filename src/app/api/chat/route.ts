import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const runtime = 'edge';

const model = process.env.NEXT_PUBLIC_LLM_MODEL || 'gpt-4o-mini';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log('受信したメッセージ:', messages);

    const response = await generateText({
      model: openai(model),
      messages,
    });

    console.log('LLMからの応答:', response);

    return new Response(JSON.stringify({
      text: response.text,
      debug: {
        input: messages,
        model
      }
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return new Response(
      JSON.stringify({ message: 'OpenAI APIでエラーが発生しました' }),
      { status: 500 }
    );
  }
} 