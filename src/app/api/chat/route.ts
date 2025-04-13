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

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const startTime = performance.now();
        try {
          let isFirstChunk = true;
          for await (const chunk of result.textStream) {
            if (isFirstChunk) {
              console.log(`ストリーミング開始までの時間: ${performance.now() - startTime}ms`);
              isFirstChunk = false;
            }
            controller.enqueue(encoder.encode(chunk));
            // デバッグ用。ストリーミングが早すぎるとクライアント側が正しくストリーミング処理できているかわからないので、
            //await new Promise(resolve => setTimeout(resolve, 1));
          }
          console.log(`ストリーミング完了までの時間: ${performance.now() - startTime}ms`);
          controller.close();
        } catch (error) {
          console.error('ストリーム処理エラー:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
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