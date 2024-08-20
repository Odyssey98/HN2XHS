import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import ReactFlow, { Node, Edge, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { useState } from 'react';

const nodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: '抓取 Hacker News 文章' },
  },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '内容分析与提取' } },
  {
    id: '3',
    position: { x: 0, y: 200 },
    data: { label: '内容是否适合小红书风格?' },
  },
  {
    id: '4',
    position: { x: -150, y: 300 },
    data: { label: '生成小红书风格文案' },
  },
  {
    id: '5',
    position: { x: 150, y: 300 },
    data: { label: '放弃并选择下一篇文章' },
  },
  {
    id: '6',
    position: { x: -150, y: 400 },
    data: { label: '一键复制' },
  },
  { id: '7', position: { x: -150, y: 500 }, data: { label: '编辑和优化' } },
  { id: '8', position: { x: -150, y: 600 }, data: { label: '发布！' } },
  {
    id: '9',
    position: { x: 0, y: 700 },
    data: { label: '分析反馈' },
  },
  {
    id: '10',
    position: { x: 0, y: 800 },
    data: { label: '调整策略' },
  },
];

const edges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4', label: '是' },
  { id: 'e3-5', source: '3', target: '5', label: '否' },
  { id: 'e4-6', source: '4', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
  { id: 'e7-8', source: '7', target: '8' },
  { id: 'e8-9', source: '8', target: '9' },
  { id: 'e9-10', source: '9', target: '10' },
  { id: 'e10-1', source: '10', target: '1', type: 'step', animated: true },
];

const About: NextPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Head>
        <title>关于 - HN转小红书</title>
        <meta name="description" content="关于HN转小红书项目" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-6 flex-grow flex flex-col">
        <div className="grid grid-cols-2 gap-4 flex-grow">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-xl font-bold mb-2 text-gray-800">产品流程图</h2>
            <div style={{ height: 'calc(100% - 2rem)' }}>
              <ReactFlow nodes={nodes} edges={edges} fitView>
                <Controls />
                <Background />
              </ReactFlow>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              这是啥玩意儿？
            </h2>
            <p className="text-base text-gray-600 mb-6">
              简单来说，我们就是把Hacker
              News上的有趣资讯搬到小红书上。不过不是简单地复制粘贴，而是把内容、图片、标题和标签都整得符合小红书的风格。这样一来，想在小红书上运营科技类账号的朋友们就方便多了！
            </p>

            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              我们想干啥？
            </h2>
            <ul className="text-base list-disc list-inside text-gray-600 mb-4">
              <li>让更多人了解最新的科技动态，不用费劲翻墙</li>
              <li>把高大上的技术话题变得通俗易懂，让大家都能聊两句</li>
              <li>激发更多人对科技的兴趣</li>
              <li>在小红书上建立一个有趣的科技社区，大家一起吹水学习</li>
            </ul>

            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                想聊聊？
              </h2>
              <p className="text-lg">邮箱：yongbi1998@proton.me</p>
              <p className="text-lg">微信：Odyssey98</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            返回首页
          </Link>
        </div>
      </main>
    </div>
  );
};

export default About;
