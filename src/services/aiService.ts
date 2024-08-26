import { HNStory } from './hackerNewsService';

export async function generateAIContent(story: HNStory) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const response = await fetch(`${apiUrl}/api/generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(story),
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error('生成 AI 内容时出错:', error.message);
      if (error.cause) {
        console.error('错误原因:', error.cause);
      }
    } else {
      console.error('生成 AI 内容时出现未知错误:', error);
    }
    throw error;
  }
}