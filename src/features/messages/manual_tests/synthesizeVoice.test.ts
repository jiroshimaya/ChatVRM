import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import playSound from "play-sound";
import { TalkStyle } from "../messages";
import { synthesizeVoice } from "../synthesizeVoice";

describe("synthesizeVoice", () => {
  it("should synthesize voice using Voicevox", async () => {
    const message = "こんにちは、テストです。";
    const style: TalkStyle = "talk";

    console.log("音声を合成します...");
    const result = await synthesizeVoice(message, style);
    console.log("音声の合成が完了しました。");

    expect(result.audio).toBeInstanceOf(ArrayBuffer);
    expect(result.audio.byteLength).toBeGreaterThan(0);

    // 一時ファイルに保存
    const tempFile = path.join(os.tmpdir(), "test.wav");
    fs.writeFileSync(tempFile, new Uint8Array(result.audio));

    // 音声を再生
    console.log("音声を再生します...");
    const player = playSound();
    await new Promise<void>((resolve, reject) => {
      player.play(tempFile, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    console.log("音声の再生が完了しました。");

    // 一時ファイルを削除
    fs.unlinkSync(tempFile);
  }, 10000); // タイムアウトを10秒に設定
}); 