import { NextApiRequest, NextApiResponse } from 'next';
import { getTopStoryIds, getStory } from '@/services/hackerNewsService';
import { generateAIContent } from '@/services/aiService';
import { saveGeneratedContent } from '@/services/databaseService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const topStoryIds = await getTopStoryIds(30);
      for (const id of topStoryIds) {
        const story = await getStory(id);
        if (story) {
          const aiContent = await generateAIContent(story);
          await saveGeneratedContent(id, aiContent);
        }
      }
      res.status(200).json({ message: '每日内容生成完成' });
    } catch (error) {
      console.error('生成内容时出错:', error);
      res.status(500).json({ error: '内容生成失败' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}