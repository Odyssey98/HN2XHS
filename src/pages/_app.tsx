import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import '../styles/globals.css';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>HN转小红书 - 科技资讯</title>
        <meta name="description" content="将Hacker News上的热门科技资讯转换为小红书风格的内容" />
        <meta name="keywords" content="Hacker News, 小红书, 科技资讯, 内容转换" />
        
      </Head>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
      <Script
          async
          src="https://cdn.seline.so/seline.js"
          data-token="d2a6dd89f4253fb"
        />
      
    </Layout>
  );
}

export default MyApp;