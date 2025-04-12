import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import playSound from "play-sound";
import { Viewer } from "../../vrmViewer/viewer";
import { Screenplay, TalkStyle } from "../messages";
import { speakCharacter } from "../speakCharacter";

describe("speakCharacter", () => {
  it("音声合成が正常に動作すること", async () => {
    // テスト用のViewerモックを作成
    const viewer = {
      model: {
        speak: async (buffer: ArrayBuffer) => {
          // 音声データを一時ファイルとして保存
          const tempFile = path.join(os.tmpdir(), "test.wav");
          fs.writeFileSync(tempFile, new Uint8Array(buffer));

          // 音声を再生
          console.log("音声を再生します...");
          const player = playSound();
          await new Promise<void>((resolve, reject) => {
            player.play(tempFile, (err) => {
              if (err) {
                reject(err);
              } else {
                // 再生後に一時ファイルを削除
                fs.unlinkSync(tempFile);
                resolve();
              }
            });
          });
        }
      }
    } as unknown as Viewer;

    // テスト用のスクリーンプレイを作成
    const screenplay: Screenplay = {
      expression: "neutral",
      talk: {
        message: "こんにちは、テストです。",
        style: "talk" as TalkStyle,
        speakerX: 0,
        speakerY: 0
      }
    };

    // speakCharacterを実行
    speakCharacter(
      screenplay,
      viewer,
      "", // apiKeyは不要になった
      () => console.log("音声合成を開始します"),
      () => console.log("音声合成が完了しました")
    );

    // 音声合成と再生が完了するまで待機
    await new Promise(resolve => setTimeout(resolve, 5000));
  }, 10000); // タイムアウトを10秒に設定
}); 