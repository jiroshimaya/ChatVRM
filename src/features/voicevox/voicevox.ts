import Client from "voicevox-client";

const client = new Client("http://127.0.0.1:50021");

export async function synthesizeVoice(text: string, speakerId: number): Promise<ArrayBuffer> {
  const audioQuery = await client.createAudioQuery(text, speakerId);
  return await audioQuery.synthesis(speakerId);
} 