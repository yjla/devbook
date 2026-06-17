import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'DevBook',
  tagline: 'AI 全栈工程师的知识体系',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://yjla.github.io',
  baseUrl: '/devbook/',

  organizationName: 'yjla',
  projectName: 'devbook',

  onBrokenLinks: 'warn',
  onDuplicateRoutes: 'ignore',

  markdown: {
    format: 'detect',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
      type: 'text/css',
    },
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    mermaid: {
      theme: { light: 'default', dark: 'dark' },
    },
    navbar: {
      title: 'DevBook',
      logo: {
        alt: 'DevBook',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'dropdown',
          label: 'AI',
          position: 'left',
          items: [
            {label: 'Claude Code', to: '/ai-coding/claude-code/user-manual/'},
          ],
        },
        {
          type: 'dropdown',
          label: '前端',
          position: 'left',
          items: [
            {label: 'HTML', to: '/html/html-structure'},
            {label: 'CSS', to: '/css/基础/选择器与优先级'},
            {label: 'JavaScript', to: '/javascript/data-types/number-precision'},
            {label: 'React', to: '/React/React.js/'},
            {label: '浏览器', to: '/browser/browser-architecture'},
            {label: '性能', to: '/performance/'},
          ],
        },
        {
          type: 'dropdown',
          label: '后端',
          position: 'left',
          items: [
            {label: 'Node.js', to: '/node.js/'},
          ],
        },
        {label: '网络', to: '/network/网络模型/', position: 'left'},
        {
          type: 'dropdown',
          label: '代码题',
          position: 'left',
          items: [
            {type: 'docSidebar', sidebarId: 'algorithm', label: '算法'},
            {type: 'docSidebar', sidebarId: 'polyfill', label: 'API 实现'},
            {type: 'docSidebar', sidebarId: 'scenario', label: '场景设计'},
          ],
        },
        {
          href: 'https://github.com/yjla/devbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} DevBook`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
