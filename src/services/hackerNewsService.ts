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

export const getTopStories = async (limit: number = 10): Promise<HNStory[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/topstories.json`);
    const storyIds = response.data.slice(0, limit);

    const storyPromises = storyIds.map((id: number) =>
      axios.get(`${BASE_URL}/item/${id}.json`)
    );

    const storyResponses = await Promise.all(storyPromises);
    return storyResponses.map((response) => response.data);
  } catch (error) {
    console.error('Error fetching top stories:', error);
    return [];
  }
};

export const getStory = async (id: number): Promise<HNStory | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/item/${id}.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error);
    return null;
  }
};
