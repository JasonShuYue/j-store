// .dumirc.ts
import { defineConfig } from 'dumi';

const isDev = process.env.NODE_ENV === 'development';

const publicPath = isDev ? '/' : '/j-store/';

export default defineConfig({
  outputPath: 'docs-dist',
  base: publicPath,
  publicPath: publicPath,
  resolve: {
    atomDirs: [{ type: 'guide', dir: 'src' }],
  },
  locales: [
    { id: 'zh-CN', name: '中文' },
    { id: 'en-US', name: 'EN' },
  ],
  favicons: [publicPath + 'logo-fill_100.png'],
  themeConfig: {
    logo: publicPath + 'logo-fill_100.png',
    name: 'React Model Store',
    nav: {
      'zh-CN': [
        { title: '指南', link: '/guides' },
        { title: 'API 文档', link: '/api' },
      ],
      'en-US': [
        { title: 'Guide', link: '/en-US/guides' },
        { title: 'API Doc', link: '/en-US/api' },
      ],
    },
    showLineNum: true,
  },
});
