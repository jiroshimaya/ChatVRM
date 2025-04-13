import { Message } from "../messages/messages";

export async function getChatResponse(messages: Message[]) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('APIリクエストの詳細:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      error: errorData,
      request: {
        messages: messages.map(m => ({ role: m.role, content: m.content.substring(0, 100) + '...' }))
      }
    });
    throw new Error(
      `APIリクエストに失敗しました (${response.status}): ${errorData.error || response.statusText}`
    );
  }

  const data = await response.json();
  return data.text;
}

export async function getChatResponseStream(messages: Message[]) {
  const startTime = performance.now();
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('APIリクエストの詳細:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      error: errorData,
      request: {
        messages: messages.map(m => ({ role: m.role, content: m.content.substring(0, 100) + '...' }))
      }
    });
    throw new Error(
      `APIリクエストに失敗しました (${response.status}): ${errorData.error || response.statusText}`
    );
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("ストリームの取得に失敗しました");
  }

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const decoder = new TextDecoder("utf-8");
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const token = decoder.decode(value);
          const timestamp = performance.now() - startTime;
          console.log(`トークン受信 [${timestamp.toFixed(2)}ms]:`, token);
          controller.enqueue(token);
        }
        console.log('ストリーミング完了までの時間:', performance.now() - startTime, 'ms');
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return stream;
}
