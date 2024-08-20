import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { getStory } from '../../services/hackerNewsService';
import {
  convertToXiaohongshu,
  XiaohongshuPost,
} from '../../services/conversionService';

interface PostPageProps {
  post: XiaohongshuPost;
}

const PostPage: NextPage<PostPageProps> = ({ post }) => {
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(context.params?.id);
  const story = await getStory(id);

  if (!story) {
    return {
      notFound: true,
    };
  }

  const post = convertToXiaohongshu(story);

  return {
    props: { post },
  };
};

export default PostPage;
