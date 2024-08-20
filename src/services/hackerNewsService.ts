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

let cachedStories: HNStory[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getTopStories = async (limit: number = 10): Promise<HNStory[]> => {
  const now = Date.now();
  if (cachedStories.length > 0 && now - lastFetchTime < CACHE_DURATION) {
    return cachedStories.slice(0, limit);
  }

  try {
    const response = await axiosInstance.get<number[]>(
      `${BASE_URL}/topstories.json`
    );
    const storyIds = response.data.slice(0, limit);

    const storyPromises = storyIds.map((id: number) =>
      axiosInstance.get<HNStory>(`${BASE_URL}/item/${id}.json`)
    );

    const storyResponses = await Promise.all(storyPromises);
    cachedStories = storyResponses.map((response) => response.data);
    lastFetchTime = now;
    return cachedStories;
  } catch (error) {
    console.error('Error fetching top stories:', error);
    return [];
  }
};

export const getStory = async (id: number): Promise<HNStory | null> => {
  const cachedStory = cachedStories.find((story) => story.id === id);
  if (cachedStory) {
    return cachedStory;
  }

  try {
    const response = await axiosInstance.get<HNStory>(
      `${BASE_URL}/item/${id}.json`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error);
    return null;
  }
};
