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
          const data = decoder.decode(value);
          const lines = data
            .split("\n")
            .filter((line) => line.trim() !== "");
          for (const line of lines) {
            const chars = [...line];
            for (const char of chars) {
              controller.enqueue(char);
            }
          }
        }
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
