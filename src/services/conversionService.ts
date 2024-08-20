import { HNStory } from './hackerNewsService';

export interface XiaohongshuPost {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageDescription: string;
  text?: string;
}

const translateToChineseSimple = (text: string): string => {
  return `[翻译] ${text}`;
};

export const convertToXiaohongshu = (story: HNStory): XiaohongshuPost => {
  const title = generateAttractiveTitle(story.title);
  const content = generateContent(story);
  const tags = generateTags(story);
  const imageDescription = generateImageDescription(story);

  return {
    id: story.id,
    title,
    content,
    tags,
    imageDescription,
    text: story.text,
  };
};

const generateAttractiveTitle = (originalTitle: string): string => {
  const translatedTitle = translateToChineseSimple(originalTitle);
  return `🔥 ${translatedTitle} 💡`;
};

const generateContent = (story: HNStory): string => {
  const translatedTitle = translateToChineseSimple(story.title);
  return `
各位小主们好！今天给大家分享一个超级有趣的科技新闻！🚀

${translatedTitle}

这个新闻来自 Hacker News，绝对是技术圈的大事件！💻✨

要点解析：
1️⃣ [这里应该是第一个要点的中文解释]
2️⃣ [这里应该是第二个要点的中文解释]
3️⃣ [这里应该是第三个要点的中文解释]

想深入了解吗？可以去看看原文哦！注意：原文是英语的哦！👇
${story.url || '链接暂未提供'}

如果觉得有收获，别忘了点赞+收藏哦！让更多小伙伴也能看到这个精彩内容！❤️📌
`.trim();
};

const generateTags = (story: HNStory): string[] => {
  return ['科技资讯', '程序员日常', 'HackerNews', '互联网趋势', '技术创新'];
};

const generateImageDescription = (story: HNStory): string => {
  return `一张体现"${translateToChineseSimple(
    story.title
  )}"主题的炫酷科技风图片`;
};
