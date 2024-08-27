import { kv } from '@vercel/kv';

export interface GeneratedContent {
  title: string;
  tags: string[];
  imageDescription: string;
  imageUrl: string | undefined; 
  content: string;
}

export async function saveGeneratedContent(id: number, content: GeneratedContent) {
  const contentToSave = {
    ...content,
    imageUrl: content.imageUrl || '' // 如果 imageUrl 是 undefined，保存为空字符串
  };
  await kv.set(`story:${id}`, JSON.stringify(contentToSave));
}

export async function getGeneratedContent(id: number): Promise<GeneratedContent | null> {
  const content = await kv.get(`story:${id}`);
  return content ? JSON.parse(content as string) : null;
}