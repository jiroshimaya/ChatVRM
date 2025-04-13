import Client from "voicevox-client";

const HOST = process.env.NEXT_PUBLIC_VOICEVOX_HOST || "http://127.0.0.1:50021";
const SPEAKER_ID = Number(process.env.NEXT_PUBLIC_VOICEVOX_SPEAKER_ID || 11);
const client = new Client(HOST);

export async function synthesizeVoice(text: string): Promise<ArrayBuffer> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('VOICEVOXリクエストの詳細:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      error: errorData,
    });
    throw new Error(
      `VOICEVOXリクエストに失敗しました (${response.status}): ${errorData.error || response.statusText}`
    );
  }

  return await response.arrayBuffer();
} 