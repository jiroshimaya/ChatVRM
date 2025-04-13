import Client from "voicevox-client";

const HOST = process.env.VOICEVOX_HOST || "http://127.0.0.1:50021";
const SPEAKER_ID = Number(process.env.VOICEVOX_SPEAKER_ID || 11);
const client = new Client(HOST);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    console.log('VOICEVOXリクエスト:', { text, speakerId: SPEAKER_ID });
    const startTime = performance.now();

    const audioQuery = await client.createAudioQuery(text, SPEAKER_ID);
    const audioBuffer = await audioQuery.synthesis(SPEAKER_ID);

    console.log(`音声合成完了までの時間: ${performance.now() - startTime}ms`);

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
      },
    });
  } catch (error) {
    console.error('VOICEVOX API error:', error);
    return new Response(
      JSON.stringify({
        message: 'VOICEVOX APIでエラーが発生しました',
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