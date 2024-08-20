import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getStory, HNStory } from '../../services/hackerNewsService';
import {
  convertToXiaohongshu,
  XiaohongshuPost,
} from '../../services/conversionService';

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<XiaohongshuPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (typeof id !== 'string') return;

      setLoading(true);
      try {
        const story = await getStory(Number(id));
        if (story) {
          const convertedPost = convertToXiaohongshu(story);
          setPost(convertedPost);
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
    return <div className="container mx-auto px-4 py-8">加载中...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">错误: {error}</div>;
  }

  if (!post) {
    return <div className="container mx-auto px-4 py-8">文章未找到</div>;
  }

  return (
    <div>
      <Head>
        <title>{post.title} - HN转小红书</title>
        <meta name="description" content={post.content.slice(0, 160)} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

        <div className="card p-6">
          <p className="whitespace-pre-line mb-4">{post.content}</p>
          {post.text && <p className="whitespace-pre-line mb-4">{post.text}</p>}
          <div className="mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-secondary text-primary rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
          </div>
          <p className="text-gray-600 italic">
            图片描述: {post.imageDescription}
          </p>
        </div>
      </main>
    </div>
  );
};

export default PostPage;
