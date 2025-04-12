import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const model = process.env.LLM_MODEL || 'gpt-4o-mini';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log('受信したメッセージ:', messages);
    console.log('使用するモデル:', model);
    console.log('APIキー:', process.env.OPENAI_API_KEY ? '設定済み' : '未設定');

    const result = streamText({
      model: openai(model),
      messages,
    });

    // ストリーミングレスポンスを返す
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('OpenAI API error:', error);
    return new Response(
      JSON.stringify({
        message: 'OpenAI APIでエラーが発生しました',
        error: error instanceof Error ? error.message : '不明なエラー'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 