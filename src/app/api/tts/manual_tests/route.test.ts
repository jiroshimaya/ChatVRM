import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import playSound from 'play-sound';
import { POST } from '../route';

describe('TTS API Route', () => {
  const TEST_BASE_URL = 'http://test.local';

  it('正常なリクエストに対して音声データを返す', async () => {
    const request = new Request(`${TEST_BASE_URL}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'こんにちは、テストです。'
      })
    });

    const response = await POST(request);
    const audioBuffer = await response.arrayBuffer();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('audio/wav');
    expect(audioBuffer.byteLength).toBeGreaterThan(0);

    // 音声データを一時ファイルとして保存して再生
    const tempFile = path.join(os.tmpdir(), 'test.wav');
    fs.writeFileSync(tempFile, new Uint8Array(audioBuffer));

    console.log('音声を再生します...');
    const player = playSound();
    await new Promise<void>((resolve, reject) => {
      player.play(tempFile, (err) => {
        if (err) {
          console.error('音声再生エラー:', err);
          reject(err);
        } else {
          fs.unlinkSync(tempFile);
          resolve();
        }
      });
    });
  }, 10000); // タイムアウトを10秒に設定
}); 