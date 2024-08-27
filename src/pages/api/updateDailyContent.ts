import { NextApiRequest, NextApiResponse } from 'next';
import { getTopStories, getStory } from '@/services/hackerNewsService';
import { convertToXiaohongshu } from '@/services/conversionService';
import { saveGeneratedContent, GeneratedContent } from '@/services/databaseService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const stories = await getTopStories(50); // 获取前50个热门故事
      for (const story of stories) {
        const convertedPost = await convertToXiaohongshu(story);
        const contentToSave: GeneratedContent = {
          title: convertedPost.title,
          tags: convertedPost.tags,
          imageDescription: convertedPost.imageDescription || '',
          imageUrl: convertedPost.imageUrl || '',
          content: convertedPost.content
        };
        await saveGeneratedContent(story.id, contentToSave);
      }
      res.status(200).json({ message: '每日内容更新完成' });
    } catch (error) {
      console.error('更新每日内容时出错:', error);
      res.status(500).json({ error: '更新失败' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}