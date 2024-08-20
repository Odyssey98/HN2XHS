import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getTopStories, HNStory } from '../services/hackerNewsService';
import {
  convertToXiaohongshu,
  XiaohongshuPost,
} from '../services/conversionService';

const Home: NextPage = () => {
  const [originalStory, setOriginalStory] = useState<HNStory | null>(null);
  const [convertedPost, setConvertedPost] = useState<XiaohongshuPost | null>(
    null
  );

  useEffect(() => {
    const fetchAndConvertStory = async () => {
      const topStories = await getTopStories(1);
      if (topStories.length > 0) {
        setOriginalStory(topStories[0]);
        setConvertedPost(convertToXiaohongshu(topStories[0]));
      }
    };

    fetchAndConvertStory();
  }, []);

  if (!originalStory || !convertedPost) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>HN to Xiaohongshu</title>
        <meta
          name="description"
          content="Convert Hacker News posts to Xiaohongshu style"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          HN to Xiaohongshu Conversion
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="original-post">
            <h2 className="text-2xl font-semibold mb-4">
              Original Hacker News Post
            </h2>
            <div className="card p-4">
              <h3 className="text-xl font-semibold mb-2">
                {originalStory.title}
              </h3>
              <p className="text-gray-600 mb-2">By: {originalStory.by}</p>
              <a
                href={originalStory.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Read original
              </a>
            </div>
          </div>

          <div className="converted-post">
            <h2 className="text-2xl font-semibold mb-4">
              Converted Xiaohongshu Style Post
            </h2>
            <div className="card p-4">
              <h3 className="text-xl font-semibold mb-2">
                {convertedPost.title}
              </h3>
              <p className="whitespace-pre-line mb-4">
                {convertedPost.content}
              </p>
              <div className="mb-2">
                {convertedPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-secondary text-primary rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 italic">
                Image: {convertedPost.imageDescription}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
