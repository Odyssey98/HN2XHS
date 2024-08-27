import { kv } from '@vercel/kv';

interface GeneratedContent {
  title: string;
  tags: string[];
  imageDescription: string;
  imageUrl: string;
  content: string;
}

export async function saveGeneratedContent(id: number, content: GeneratedContent) {
  await kv.set(`story:${id}`, JSON.stringify(content));
}

export async function getGeneratedContent(id: number): Promise<GeneratedContent | null> {
  const content = await kv.get(`story:${id}`);
  return content ? JSON.parse(content as string) : null;
}