import axios from 'axios';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export interface HNStory {
  id: number;
  title: string;
  url: string;
  by: string;
  time: number;
  score: number;
}

const axiosInstance = axios.create({
  timeout: 5000, // 5 seconds timeout
});

let cachedStoryIds: number[] = [];
let cachedStories: { [id: number]: HNStory } = {};
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getTopStories = async (
  limit: number = 10,
  offset: number = 0
): Promise<HNStory[]> => {
  const now = Date.now();
  if (cachedStoryIds.length === 0 || now - lastFetchTime >= CACHE_DURATION) {
    try {
      const response = await axiosInstance.get<number[]>(
        `${BASE_URL}/topstories.json`
      );
      cachedStoryIds = response.data;
      lastFetchTime = now;
    } catch (error) {
      console.error('Error fetching top story IDs:', error);
      return [];
    }
  }

  const storyIds = cachedStoryIds.slice(offset, offset + limit);
  const stories = await Promise.all(storyIds.map((id) => getStory(id)));
  return stories.filter((story): story is HNStory => story !== null);
};

export const getStory = async (id: number): Promise<HNStory | null> => {
  if (cachedStories[id]) {
    return cachedStories[id];
  }

  try {
    const response = await axiosInstance.get<HNStory>(
      `${BASE_URL}/item/${id}.json`
    );
    cachedStories[id] = response.data;
    return response.data;
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error);
    return null;
  }
};
