import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { getStory, HNStory } from '../../services/hackerNewsService';
import { convertToXiaohongshu, XiaohongshuPost } from '../../services/conversionService';
import { Toast } from '@/components/Toast';
import SkeletonXHS from '@/components/SkeletonXHS';

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<XiaohongshuPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(Number(id));
    }
  }, [id]);

  const fetchPost = async (postId: number) => {
    try {
      const story = await getStory(postId);
      if (!story) {
        setError('文章未找到');
        return;
      }

      const convertedPost = await convertToXiaohongshu(story);
      setPost(convertedPost);
      setLoading(false);

      // 异步获取AI生成的内
      fetchAIContent(story);
    } catch (err) {
      console.error('Error fetching story:', err);
      setError('获取文章时发生错误');
      setLoading(false);
    }
  };

  const fetchAIContent = async (story: HNStory) => {
    try {
      const response = await fetch('/api/generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story),
      });
      const aiContent = await response.json();
      setPost(prevPost => ({
        ...prevPost!,
        title: aiContent.title ?? prevPost!.title,
        tags: aiContent.tags ?? prevPost!.tags,
        imageDescription: aiContent.imageDescription ?? prevPost!.imageDescription,
        imageUrl: aiContent.imageUrl ?? prevPost!.imageUrl,
        content: aiContent.content ?? prevPost!.content,
      }));
    } catch (err) {
      console.error('Error fetching AI content:', err);
    }
  };

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

  const avatarUrl = `https://ui-avatars.com/api/?name=HN&background=random&color=fff&size=100`;

  if (loading) {
    return <SkeletonXHS />;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">错误: {error}</div>;
  }

  if (!post) {
    return <div className="container mx-auto px-4 py-8">文章未找到</div>;
  }

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-2">
      <Head>
        <title>{post.title} - HN转小红书</title>
        <meta name="description" content={post.content ? post.content.slice(0, 160) : ''} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
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
                    alt={post.imageDescription || ''}
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
                {post.content && (
                  <p
                    className="text-sm text-gray-700 mb-2 cursor-pointer hover:text-blue-600"
                    onClick={() => copyToClipboard(post.content)}
                  >
                    {post.content}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2 mb-2">
            {post?.tags?.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer hover:text-blue-600"
                onClick={() => copyToClipboard(`#${tag}`)}
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center text-gray-500 text-xs mt-1">
            <div className="flex items-center">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold transition duration-300 ease-in-out flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                原文链接
              </a>
              <span className="ml-3">阅读 {Math.floor(Math.random() * 10000)}</span>
            </div>
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