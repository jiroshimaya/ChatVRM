import { openai } from '@ai-sdk/openai';
import { CoreMessage, generateText } from 'ai';

async function testChat() {
  try {
    const model = openai.chat('gpt-4o-mini');
    const messages: CoreMessage[] = [{ role: 'user', content: 'こんにちは' }];

    console.log('送信するメッセージ:', messages);

    const text = await generateText({
      model,
      messages,
    });

    console.log('LLMからの応答:', text);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

testChat(); 