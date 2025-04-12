import Client from "voicevox-client";

const HOST = process.env.NEXT_PUBLIC_VOICEVOX_HOST || "http://127.0.0.1:50021";
const SPEAKER_ID = Number(process.env.NEXT_PUBLIC_VOICEVOX_SPEAKER_ID || 1);
const client = new Client(HOST);

export async function synthesizeVoice(text: string): Promise<ArrayBuffer> {
  const audioQuery = await client.createAudioQuery(text, SPEAKER_ID);
  return await audioQuery.synthesis(SPEAKER_ID);
} 