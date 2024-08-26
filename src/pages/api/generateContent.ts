import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { HNStory } from '../../services/hackerNewsService';

const apiKey = process.env.ARK_API_KEY;

if (!apiKey) {
  console.error('ARK_API_KEY 环境变量未设置或为空');
  throw new Error('ARK_API_KEY 环境变量未设置或为空');
}

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只允许 POST 请求' });
  }

  console.log('收到请求体:', req.body);

  try {
    const story: HNStory = req.body;

    console.log('开始生成标题...');
    const titleCompletion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: '你是一个专业的小红书标题撰写者。' },
        {
          role: 'user',
          content: `根据以下内容生成一个吸引人的小红书标题：${story.title}`,
        },
      ],
      model: 'ep-20240820165714-ckvrz',
    });
    const title = titleCompletion.choices[0]?.message?.content;
    console.log('生成的标题:', title);

    console.log('开始生成标签...');
    const tagsCompletion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: '你是一个专业的小红书标签生成器。' },
        {
          role: 'user',
          content: `根据以下内容生成5个相关的小红书标签：${story.title}`,
        },
      ],
      model: 'ep-20240820165714-ckvrz',
    });
    const tags = tagsCompletion.choices[0]?.message?.content?.split(',') || [];
    console.log('生成的标签:', tags);

    console.log('开始生成图片描述...');
    const imageDescriptionCompletion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: '你是一个专业的图片描述生成器。' },
        {
          role: 'user',
          content: `根据以下内容生成一个简短的图片描述：${story.title}`,
        },
      ],
      model: 'ep-20240820165714-ckvrz',
    });
    const imageDescription =
      imageDescriptionCompletion.choices[0]?.message?.content;
    console.log('生成的图片描述:', imageDescription);

    console.log('开始生成内容...');
    const contentCompletion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: '你是一个专业的小红书内容创作者。' },
        {
          role: 'user',
          content: `根据以下标题生成一篇吸引人的小红书内容，包括简介、要点分析和结语：${story.title}`,
        },
      ],
      model: 'ep-20240820165714-ckvrz',
    });
    const content = contentCompletion.choices[0]?.message?.content;
    console.log('生成的内容:', content);

    const imageUrl = `https://picsum.photos/seed/${Math.floor(
      Math.random() * 1000
    )}/1024/1024`;

    const result = { title, tags, imageDescription, content, imageUrl };
    console.log('生成的结果:', result);

    res.status(200).json(result);
  } catch (error) {
    console.error('豆包AI API 调用出错:', error);
    res.status(500).json({ message: '内部服务器错误', error: error });
  }
}