import { NextApiRequest, NextApiResponse } from 'next';
import { initializeTopStories } from '@/services/hackerNewsService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await initializeTopStories();
      res.status(200).json({ message: '热门故事初始化完成' });
    } catch (error) {
      console.error('初始化热门故事时出错:', error);
      res.status(500).json({ error: '初始化失败' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}