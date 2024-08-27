import axios from 'axios';
import { kv } from '@vercel/kv';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export interface HNStory {
  id: number;
  title: string;
  url: string;
  by: string;
  time: number;
  score: number;
  text: string;
  imageUrl: string; // 新增字段
}

const axiosInstance = axios.create({
  timeout: 10000,
});

const DAILY_CACHE_DURATION = 24 * 60 * 60; // 24小时缓存（秒）
const TOP_STORIES_COUNT = 50; // 每天缓存的热门故事数量

export const getTopStories = async (
  limit: number = 10,
  offset: number = 0
): Promise<HNStory[]> => {
  try {
    const cacheKey = 'daily_top_stories';
    let cachedStories = await kv.get<HNStory[]>(cacheKey);

    if (!cachedStories) {
      const storyIds = await fetchTopStoryIds();
      cachedStories = await fetchAndCacheStories(storyIds.slice(0, TOP_STORIES_COUNT));
      await kv.set(cacheKey, cachedStories, { ex: DAILY_CACHE_DURATION });
    }

    return cachedStories.slice(offset, offset + limit);
  } catch (error) {
    console.error('获取热门故事时出错:', error);
    return [];
  }
};

const fetchTopStoryIds = async (): Promise<number[]> => {
  const response = await axiosInstance.get<number[]>(`${BASE_URL}/topstories.json`);
  return response.data;
};

const fetchAndCacheStories = async (ids: number[]): Promise<HNStory[]> => {
  const stories = await Promise.all(ids.map(id => getStory(id)));
  return stories.filter((story): story is HNStory => story !== null).map(story => ({
    ...story,
    imageUrl: `https://picsum.photos/seed/${story.id}/1024/1024` // 为每个故事生成图片 URL
  }));
};

export const getStory = async (id: number): Promise<HNStory | null> => {
  const cacheKey = `story_${id}`;
  let story = await kv.get<HNStory>(cacheKey);

  if (!story) {
    try {
      const response = await axiosInstance.get<HNStory>(
        `${BASE_URL}/item/${id}.json`
      );
      story = {
        ...response.data,
        imageUrl: `https://picsum.photos/seed/${id}/1024/1024` // 为每个故事生成一个唯一的图片 URL
      };
      await kv.set(cacheKey, story, { ex: DAILY_CACHE_DURATION });
    } catch (error) {
      console.error(`Error fetching story ${id}:`, error);
      return null;
    }
  }

  return story;
};