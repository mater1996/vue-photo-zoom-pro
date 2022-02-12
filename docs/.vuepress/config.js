const { description } = require('../../package')

module.exports = {
  title: 'VuePhotoZoomPro',
  base: '/vue-photo-zoom-pro/',
  description: description,
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    [
      'link',
      {
        href: 'https://cdn.jsdelivr.net/npm/swiper@4.5.1/dist/css/swiper.min.css',
        type: 'text/css',
        rel: 'stylesheet',
      },
    ],
    [
      'script',
      {
        src: 'https://cdn.jsdelivr.net/npm/swiper@4.5.1/dist/js/swiper.min.js',
      },
    ],
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'VuePhotoZoomPro',
      description: 'Vue picture magnifier',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'VuePhotoZoomPro',
      description: 'Vue图片放大镜',
    },
  },
  themeConfig: {
    locales: {
      '/': {
        selectText: 'Languages',
        nav: [
          {
            text: 'Guide',
            link: '/guide/',
          },
          {
            text: 'Setting',
            link: '/setting/props',
          },
          {
            text: 'Demo',
            link: '/demo/image',
          },
        ],
        sidebar: {
          '/demo/': [
            {
              title: 'Demo',
              collapsable: false,
              children: [
                'image',
                'canvas',
                'swiper',
                'custom',
                'full',
                'mini-map',
              ],
            },
          ],
          '/setting/': [
            {
              title: 'Setting',
              collapsable: false,
              children: ['props', 'event', 'methods', 'slot', 'plugins'],
            },
          ],
        },
      },
      '/zh/': {
        selectText: '选择语言',
        nav: [
          {
            text: '指南',
            link: '/zh/guide/',
          },
          {
            text: '配置',
            link: '/zh/setting/props',
          },
          {
            text: '示例',
            link: '/zh/demo/image',
          },
        ],
        sidebar: {
          '/zh/demo/': [
            {
              title: '示例',
              collapsable: false,
              children: [
                'image',
                'canvas',
                'swiper',
                'custom',
                'full',
                'mini-map',
              ],
            },
          ],
          '/zh/setting/': [
            {
              title: '配置',
              collapsable: false,
              children: ['props', 'event', 'methods', 'slot', 'plugins'],
            },
          ],
        },
      },
    },
    repo: 'https://github.com/mater1996/vue-photo-zoom-pro',
    editLinks: false,
    docsDir: 'https://github.com/mater1996/vue-photo-zoom-pro',
    editLinkText: '',
    lastUpdated: false,
  },
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],
}
