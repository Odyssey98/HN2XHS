import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getTopStories, HNStory } from '../services/hackerNewsService';
import SkeletonHN from '@/components/SkeletonHN';

interface EnhancedPost {
  id: number;
  title: string;
  author: string;
  likes: number;
  tags: string[];
  imageUrl: string;
  avatarUrl: string;
}

const ITEMS_PER_PAGE = 12;

const Home: NextPage = () => {
  const [posts, setPosts] = useState<EnhancedPost[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  const enhancePost = (story: HNStory): EnhancedPost => {
    const initials = story.by.split(' ').map(name => name[0]).join('').toUpperCase();
    return {
      id: story.id,
      title: story.title,
      author: story.by,
      likes: story.score,
      tags: ['科技', '创新', 'Hacker News']
        .sort(() => 0.5 - Math.random())
        .slice(0, 2),
      imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(story.title)}&background=random&size=300`,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&size=40`,
    };
  };

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
    <div className="bg-white min-h-screen">
      <Head>
        <title>HN转小红书 - 科技资讯</title>
        <meta name="description" content="Hacker News 文章转换为小红书风格" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          HN转小红书 - 最新科技资讯
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.length === 0
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <SkeletonHN key={index} />
              ))
            : posts.map((post) => (
                <Link href={`/post/${post.id}`} key={post.id} className="block">
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1 border border-gray-200">
                    <div className="relative h-48">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h2 className="text-xl font-semibold mb-3 line-clamp-2 text-gray-800">
                        {post.title}
                      </h2>
                      <div className="flex items-center mb-3">
                        <Image
                          src={post.avatarUrl}
                          alt={post.author}
                          width={24}
                          height={24}
                          className="rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-600">
                          {post.author}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-1"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          {post.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
        {hasMore && (
          <div ref={loader} className="text-center py-8">
            {loading ? (
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            ) : (
              <span className="text-gray-600">下拉加载更多</span>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;