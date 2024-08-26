import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { HNStory } from '../../services/hackerNewsService';
import { kv } from '@vercel/kv';

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
    const cacheKey = `generated_content_${story.id}`;

    // 检查 Vercel KV 缓存中是否已有生成的内容
    const cachedResult = await kv.get(cacheKey);
    if (cachedResult) {
      console.log('使用缓存的生成内容');
      return res.status(200).json(cachedResult);
    }

    // 如果缓存中没有，则生成新内容
    console.log('生���新内容...');
    const result = await generateContent(story);

    // 将生成的内容存入 Vercel KV 缓存，不设置过期时间
    await kv.set(cacheKey, result);

    res.status(200).json(result);
  } catch (error) {
    console.error('豆包AI API 调用出错:', error);
    res.status(500).json({ message: '内部服务器错误', error: error });
  }
}

async function generateContent(story: HNStory) {
  const [titleResult, tagsResult, imageDescriptionResult, contentResult] = await Promise.all([
    generateTitle(story),
    generateTags(story),
    generateImageDescription(story),
    generateMainContent(story),
  ]);

  const imageUrl = `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/1024/1024`;

  return {
    title: titleResult,
    tags: tagsResult,
    imageDescription: imageDescriptionResult,
    content: contentResult,
    imageUrl,
  };
}

async function generateTitle(story: HNStory) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: '你是一个专业的小红书标题撰写者。' },
      { role: 'user', content: `根据以下内容生成一个吸引人的小红书标题：${story.title}` },
    ],
    model: 'ep-20240820165714-ckvrz',
  });
  return completion.choices[0]?.message?.content || story.title;
}

async function generateTags(story: HNStory) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: '你是一个专业的小红书标签生成器。' },
      { role: 'user', content: `根据以下内容生成5个相关的小红书标签：${story.title}` },
    ],
    model: 'ep-20240820165714-ckvrz',
  });
  return completion.choices[0]?.message?.content?.split(',') || [];
}

async function generateImageDescription(story: HNStory) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: '你是一个专业的图片描述生成器。' },
      { role: 'user', content: `根据以下内容生成一个简短的图片描述：${story.title}` },
    ],
    model: 'ep-20240820165714-ckvrz',
  });
  return completion.choices[0]?.message?.content;
}

async function generateMainContent(story: HNStory) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: '你是一个专业的小红书内容创作者。' },
      { role: 'user', content: `根据以下标题生成一篇吸引人的小红书内容，包括简介、要点分析和结语：${story.title}` },
    ],
    model: 'ep-20240820165714-ckvrz',
  });
  return completion.choices[0]?.message?.content;
}