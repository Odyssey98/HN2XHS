import { HNStory } from './hackerNewsService';

export async function generateAIContent(story: HNStory) {
  try {
    const response = await fetch('/api/generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(story),
    });

    if (!response.ok) {
      throw new Error('API 请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('生成 AI 内容时出错:', error);
    throw error;
  }
}
