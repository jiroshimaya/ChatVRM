import dotenv from 'dotenv';
import { Message } from "../../messages/messages";

// .envファイルを読み込む
dotenv.config();

// 環境変数が設定された後にchatClientをインポート
import { getChatResponse, getChatResponseStream } from "../chatClient";

/**
 * LLM APIの呼び出しをテストするスクリプト
 * バックエンドのAPIを使用して、
 * getChatResponse関数の動作をテストします。
 */

describe("Environment variables", () => {
  it("should load environment variables", () => {
    console.log("OPEN_AI_KEY:", process.env.OPENAI_API_KEY);
    console.log("LLM_MODEL:", process.env.LLM_MODEL);
    expect(process.env.OPENAI_API_KEY).toBeDefined();
    expect(process.env.LLM_MODEL).toBeDefined();
  });
});

describe("LLM API", () => {
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