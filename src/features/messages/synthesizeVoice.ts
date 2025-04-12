import { TalkStyle } from "../messages/messages";
import { synthesizeVoice as voicevoxSynthesizeVoice } from "../voicevox/voicevox";

export type SynthesizerType = 'voicevox';

export async function synthesizeVoice(
  message: string,
  style: TalkStyle
): Promise<{ audio: ArrayBuffer }> {
  const synthesizerType = process.env.NEXT_PUBLIC_SYNTHESIZER_TYPE as SynthesizerType || 'voicevox';

  switch (synthesizerType) {
    case 'voicevox':
      const audio = await voicevoxSynthesizeVoice(message);
      return { audio };
    default:
      throw new Error(`Unsupported synthesizer type: ${synthesizerType}`);
  }
}

