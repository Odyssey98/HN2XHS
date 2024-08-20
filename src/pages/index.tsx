import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getTopStories, HNStory } from '../services/hackerNewsService';

interface EnhancedPost {
  id: number;
  title: string;
  author: string;
  likes: number;
  tags: string[];
  imageUrl: string;
}

const ITEMS_PER_PAGE = 12;

const Home: NextPage = () => {
  const [posts, setPosts] = useState<EnhancedPost[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  const enhancePost = (story: HNStory): EnhancedPost => ({
    id: story.id,
    title: story.title,
    author: story.by,
    likes: story.score,
    tags: ['科技', '创新', 'Hacker News']
      .sort(() => 0.5 - Math.random())
      .slice(0, 2),
    imageUrl: `https://picsum.photos/seed/${story.id}/300/200`,
  });

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const newStories = await getTopStories(
        ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      );
      if (newStories.length === 0) {
        setHasMore(false);
      } else {
        const newPosts = newStories.map(enhancePost);
        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadMorePosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [loadMorePosts, loading]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>HN转小红书 - 科技资讯</title>
        <meta name="description" content="Hacker News 文章转换为小红书风格" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          HN转小红书 - 最新科技资讯
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id}>
              <div className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-40">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center mb-2">
                    <Image
                      src={`https://i.pravatar.cc/40?u=${post.author}`}
                      alt={post.author}
                      width={20}
                      height={20}
                      className="rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-600">{post.author}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-200 rounded-full px-2 py-1"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {post.likes} 赞
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {hasMore && (
          <div ref={loader} className="text-center py-8">
            {loading ? '加载中...' : '下拉加载更多'}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
