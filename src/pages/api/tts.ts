import { synthesizeVoice } from "@/features/voicevox/voicevox";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ArrayBuffer;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const message = req.body.message;
  const speakerId = req.body.speakerId;

  const audio = await synthesizeVoice(message, speakerId);

  res.status(200).send(audio);
}
