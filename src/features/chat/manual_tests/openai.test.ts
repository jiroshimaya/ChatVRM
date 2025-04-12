import dotenv from 'dotenv';
import { Message } from "../../messages/messages";

// .envファイルを読み込む
dotenv.config();

// 環境変数が設定された後にopenAiChatをインポート
import { getChatResponse, getChatResponseStream } from "../openAiChat";

/**
 * OpenAI APIの呼び出しをテストするスクリプト
 * バックエンドのAPIを使用して、
 * getChatResponse関数の動作をテストします。
 */

describe("Environment variables", () => {
  it("should load environment variables", () => {
    console.log("OPEN_AI_KEY:", process.env.OPEN_AI_KEY);
    console.log("NEXT_PUBLIC_LLM_MODEL:", process.env.NEXT_PUBLIC_LLM_MODEL);
    expect(process.env.OPEN_AI_KEY).toBeDefined();
    expect(process.env.NEXT_PUBLIC_LLM_MODEL).toBeDefined();
  });
});

describe("OpenAI API", () => {
  it("should return a response", async () => {
    const messages: Message[] = [
      {
        role: "user",
        content: "こんにちは",
      },
    ];

    const response = await getChatResponse(messages);
    console.log(response);
    expect(response.message).toBeDefined();
  });

  it("should return a stream response", async () => {
    const messages: Message[] = [
      {
        role: "user",
        content: "こんにちは",
      },
    ];

    const response = await getChatResponseStream(messages);
    console.log(response);
    expect(response).toBeDefined();
  });
});

// 別のモデルでもテスト（オプション）
// testOpenAiCall(apiKey, "gpt-4"); 