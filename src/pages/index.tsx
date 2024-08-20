import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getTopStories, HNStory } from '../services/hackerNewsService';

interface MinimalPost {
  id: number;
  title: string;
}

const ITEMS_PER_PAGE = 10;

const Home: NextPage = () => {
  const [posts, setPosts] = useState<MinimalPost[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const loader = useRef<HTMLDivElement>(null);

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
        const newPosts = newStories.map((story) => ({
          id: story.id,
          title: story.title,
        }));
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
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [loadMorePosts]);

  return (
    <div>
      <Head>
        <title>HN转小红书 - 科技资讯</title>
        <meta name="description" content="Hacker News 文章转换为小红书风格" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">HN转小红书 - 最新科技资讯</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id}>
              <div className="card p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              </div>
            </Link>
          ))}
        </div>
        {hasMore && (
          <div ref={loader} className="text-center py-4">
            {loading ? '加载中...' : '下拉加载更多'}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
