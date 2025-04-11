import * as fs from "fs";
import * as path from "path";
import playSound from "play-sound";
import { synthesizeVoice } from "../voicevox";

const player = playSound();

describe("VoiceVox", () => {
  it("音声合成が正常に動作すること", async () => {
    const text = "こんにちは";
    const speakerId = 1;

    const result = await synthesizeVoice(text, speakerId);

    expect(result).toBeInstanceOf(ArrayBuffer);
    expect(result.byteLength).toBeGreaterThan(0);

    // 音声データを一時ファイルとして保存
    const tempFile = path.join(__dirname, "temp.wav");
    fs.writeFileSync(tempFile, new Uint8Array(result));

    // 音声を再生
    console.log("音声を再生します...");
    player.play(tempFile, (err: Error | null) => {
      if (err) console.error("音声再生エラー:", err);
      // 再生後に一時ファイルを削除
      fs.unlinkSync(tempFile);
    });
  });
}); 