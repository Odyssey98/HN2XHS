import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getTopStories, HNStory } from '../services/hackerNewsService';
import {
  convertToXiaohongshu,
  XiaohongshuPost,
} from '../services/conversionService';

interface HomeProps {
  convertedPosts: XiaohongshuPost[];
}

const Home: NextPage<HomeProps> = ({ convertedPosts }) => {
  const router = useRouter();

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
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const topStories = await getTopStories(10);
    const convertedPosts = topStories.map((story) =>
      convertToXiaohongshu(story)
    );
    return { props: { convertedPosts } };
  } catch (error) {
    console.error('Error fetching stories:', error);
    return { props: { convertedPosts: [] } };
  }
};

export default Home;
