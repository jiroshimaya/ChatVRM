import { POST } from '../route';

describe('Chat API Route', () => {
  const TEST_BASE_URL = 'http://test.local';

  it('正常なリクエストに対して適切なレスポンスを返す', async () => {
    const request = new Request(`${TEST_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'こんにちは' }]
      })
    });

    const response = await POST(request);
    const data = await response.json();

    console.log('APIレスポンス:', JSON.stringify(data, null, 2));

    // レスポンスの構造を検証
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('text');
    expect(data).toHaveProperty('debug');
    expect(data.debug).toEqual({
      input: [{ role: 'user', content: 'こんにちは' }],
      model: 'gpt-4o-mini'
    });

    // レスポンスの内容が文字列であることを確認
    expect(typeof data.text).toBe('string');
    expect(data.text.length).toBeGreaterThan(0);
  });
}); 