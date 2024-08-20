import type { NextPage } from 'next';
import Head from 'next/head';

const Admin: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Admin - HN to Xiaohongshu</title>
        <meta name="description" content="Admin page for HN to Xiaohongshu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Admin Dashboard</h1>
        <p>Here you can manage and approve converted posts.</p>
      </main>
    </div>
  );
};

export default Admin;
