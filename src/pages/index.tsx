import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getTopStories, HNStory } from '../services/hackerNewsService';
import {
  convertToXiaohongshu,
  XiaohongshuPost,
} from '../services/conversionService';

const ITEMS_PER_PAGE = 10;

const Home: NextPage = () => {
  const [convertedPosts, setConvertedPosts] = useState<XiaohongshuPost[]>([]);
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
        const newPosts = newStories.map((story) => convertToXiaohongshu(story));
        setConvertedPosts((prev) => [...prev, ...newPosts]);
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

  const handlePostClick = (postId: number) => {
    router.prefetch(`/post/${postId}`);
  };

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
          {convertedPosts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id} passHref>
              <div
                className="card p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onMouseEnter={() => handlePostClick(post.id)}
              >
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-2">
                  {post.content.slice(0, 100)}...
                </p>
                <div className="mt-2">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-secondary text-primary rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
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
