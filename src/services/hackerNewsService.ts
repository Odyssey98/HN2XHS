import axios from 'axios';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export interface HNStory {
  id: number;
  title: string;
  url: string;
  by: string;
  time: number;
  score: number;
  text: string;
}

const axiosInstance = axios.create({
  timeout: 10000,
});

let cachedStoryIds: number[] = [];
let cachedStories: { [id: number]: HNStory } = {};

export const getTopStories = async (
  limit: number = 10,
  offset: number = 0
): Promise<HNStory[]> => {
  try {
    if (cachedStoryIds.length === 0) {
      const response = await axiosInstance.get<number[]>(
        `${BASE_URL}/topstories.json`
      );
      cachedStoryIds = response.data;
    }

    const storyIds = cachedStoryIds.slice(offset, offset + limit);
    const stories = await Promise.all(
      storyIds.map(async (id) => {
        if (!cachedStories[id]) {
          const response = await axiosInstance.get<HNStory>(
            `${BASE_URL}/item/${id}.json`
          );
          cachedStories[id] = response.data;
        }
        return cachedStories[id];
      })
    );

    return stories;
  } catch (error) {
    console.error('Error fetching top stories:', error);
    return [];
  }
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
