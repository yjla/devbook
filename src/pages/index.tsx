import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const categories = [
  {
    title: 'AI',
    description: '不只是会用，而是真正理解 AI 工具的工作原理与边界。',
    topics: ['Claude Code', 'AI 工作流', '提示工程'],
    link: '/ai-coding/overview/llm-history/',
  },
  {
    title: 'Web 前端',
    description: '从语言基础到框架原理，建立系统性的前端工程认知。',
    topics: ['HTML / CSS', 'JavaScript', 'Vue / React'],
    link: '/html/html-structure',
  },
  {
    title: 'Node.js',
    description: '服务端视角下的 JavaScript——运行时、模块系统与工程实践。',
    topics: ['运行时原理', '模块系统', 'API 设计'],
    link: '/node.js/',
  },
  {
    title: '网络',
    description: '每一次请求背后发生了什么，是工程师必须真正理解的事。',
    topics: ['HTTP / HTTPS', 'TCP/IP', '安全与鉴权'],
    link: '/network/网络模型/',
  },
];

export default function Home() {
  return (
    <Layout title="DevBook" description="AI 全栈工程师的知识体系">
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.headline}>
            AI 全栈工程师<br />的知识体系
          </h1>
          <p className={styles.description}>
            这里是我在成为 AI 全栈工程师路上积累的知识与思考。
            <br />
            不以面试为导向，只求真实理解与工程实践。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>知识体系</h2>
          <div className={styles.grid}>
            {categories.map((cat) => (
              <Link key={cat.title} to={cat.link} className={styles.card}>
                <h3 className={styles.cardTitle}>{cat.title}</h3>
                <p className={styles.cardDesc}>{cat.description}</p>
                <ul className={styles.topics}>
                  {cat.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
