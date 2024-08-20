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
      <div className="bg-white min-h-[70vh] flex items-start justify-center p-2 pt-8">
        <div className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-3">
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
    <div className="bg-white min-h-[70vh] flex items-start justify-center p-2 pt-8">
      <Head>
        <title>{post.title} - HN转小红书</title>
        <meta name="description" content={post.content.slice(0, 160)} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-auto">
        <div className="p-3 lg:p-4 flex flex-col">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full mr-2 overflow-hidden">
              <Image
                src={avatarUrl}
                alt="用户头像"
                width={32}
                height={32}
                layout="responsive"
              />
            </div>
            <div>
              <h2 className="font-bold text-sm">HN转小红书</h2>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 mb-2 lg:mb-0 lg:mr-3 flex-shrink-0">
              <div className="relative w-full h-0 pb-[75%]">
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
            <div className="lg:w-1/2 flex flex-col">
              <div className="overflow-y-auto max-h-[250px]">
                <h1
                  className="text-lg lg:text-xl font-bold mb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => copyToClipboard(post.title)}
                >
                  {post.title}
                </h1>
                <p
                  className="text-sm text-gray-700 mb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => copyToClipboard(post.content)}
                >
                  {post.content}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer hover:text-blue-600"
                      onClick={() => copyToClipboard(`#${tag}`)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-gray-500 text-xs mt-1">
            <span>阅读 {Math.floor(Math.random() * 10000)}</span>
            <div className="flex gap-3">
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
