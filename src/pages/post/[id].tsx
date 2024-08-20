import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getStory, HNStory } from '../../services/hackerNewsService';
import {
  convertToXiaohongshu,
  XiaohongshuPost,
} from '../../services/conversionService';
import { generateAIContent } from '../../services/aiService';
import Image from 'next/image';
import { Toast } from '@/components/Toast';
import Skeleton from '@/components/Skeleton';

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<XiaohongshuPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      })
      .catch((err) => {
        console.error('复制失败:', err);
      });
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (typeof id !== 'string') return;

      setLoading(true);
      try {
        const story = await getStory(Number(id));
        if (story) {
          const convertedPost = convertToXiaohongshu(story);

          // 使用AI生成内容
          const aiContent = await generateAIContent(story);

          setPost({
            ...convertedPost,
            title: aiContent.title ?? '',
            tags: aiContent.tags ?? [],
            imageDescription: aiContent.imageDescription ?? '',
            imageUrl: aiContent.imageUrl ?? '',
          });
        } else {
          setError('文章未找到');
        }
      } catch (err) {
        console.error('Error fetching story:', err);
        setError('获取文章时发生错误');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">
          <Skeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">错误: {error}</div>;
  }

  if (!post) {
    return <div className="container mx-auto px-4 py-8">文章未找到</div>;
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=HN&background=random&color=fff&size=100`;

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <Head>
        <title>{post.title} - HN转小红书</title>
        <meta name="description" content={post.content.slice(0, 160)} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full mr-3 overflow-hidden">
              <Image
                src={avatarUrl}
                alt="用户头像"
                width={40}
                height={40}
                layout="responsive"
              />
            </div>
            <div>
              <h2 className="font-bold">HN转小红书</h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-4 md:mb-0 md:mr-4">
              <div className="relative w-full h-0 pb-[100%]">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.imageDescription}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <h1
                className="text-2xl font-bold mb-4 cursor-pointer hover:text-blue-600"
                onClick={() => copyToClipboard(post.title)}
              >
                {post.title}
              </h1>
              <p
                className="text-gray-700 mb-4 cursor-pointer hover:text-blue-600"
                onClick={() => copyToClipboard(post.content)}
              >
                {post.content}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 rounded-full px-3 py-1 text-sm cursor-pointer hover:text-blue-600"
                    onClick={() => copyToClipboard(tag)}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-gray-500 text-sm mt-4">
            <span>阅读 {Math.floor(Math.random() * 10000)}</span>
            <div className="flex gap-4">
              <span>点赞</span>
              <span>收藏</span>
              <span>分享</span>
            </div>
          </div>
        </div>
      </main>

      {showToast && <Toast message="内容已复制" />}
    </div>
  );
};

export default PostPage;
