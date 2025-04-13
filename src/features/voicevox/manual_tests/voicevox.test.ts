import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import playSound from "play-sound";
import { synthesizeVoice } from "../voicevox";

// テスト用のグローバル設定
const TEST_BASE_URL = 'http://localhost:3000';
global.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  // 相対パスの場合、ベースURLを追加
  const url = input.toString();
  const fullUrl = url.startsWith('http') ? url : `${TEST_BASE_URL}${url}`;
  return fetch(fullUrl, init);
}) as typeof fetch;

describe("VoiceVox Client", () => {
  it("音声合成APIが正常に動作すること", async () => {
    const text = "こんにちは、テストです。";

    console.log("音声を合成します...");
    const result = await synthesizeVoice(text);
    console.log("音声の合成が完了しました。");

    expect(result).toBeInstanceOf(ArrayBuffer);
    expect(result.byteLength).toBeGreaterThan(0);

    // 音声データを一時ファイルとして保存
    const tempFile = path.join(os.tmpdir(), "test.wav");
    fs.writeFileSync(tempFile, new Uint8Array(result));

    // 音声を再生して完了を待つ
    console.log("音声を再生します...");
    const player = playSound();
    await new Promise<void>((resolve, reject) => {
      player.play(tempFile, (err) => {
        if (err) {
          console.error("音声再生エラー:", err);
          reject(err);
        } else {
          // 再生後に一時ファイルを削除
          fs.unlinkSync(tempFile);
          resolve();
        }
      });
    });
    console.log("音声の再生が完了しました。");
  }, 10000); // タイムアウトを10秒に設定
}); 