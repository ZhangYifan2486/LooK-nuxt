export default defineNuxtConfig({
  devtools: { enabled: process.env.DEV_TOOLS || true },
  // css单独文件引用，不使用内联
  experimental: {
    inlineSSRStyles: false
  },
  modules: ['@element-plus/nuxt', 'dayjs-nuxt'],
  css: ['@/assets/css/main.css', 'element-plus/dist/index.css', 'element-plus/theme-chalk/display.css'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "assets/scss/var.scss";'
        }
      }
    }
  },
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
      title: 'LooK动漫网',
      meta: [
        { name: 'keywords', content: 'LooK动漫,最新动漫，最新剧场版！！' },
        {
          name: 'description',
          content: 'LooK动漫,最新动漫，最新剧场版！！'
        }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/flo.svg' }]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: '/server',
      globalTitle: 'LooK动漫'
    }
  },
  nitro: {
    devProxy: {
      '/server': {
        target: process.env.BASE_URL || 'http://101.37.70.236:4000',
        changeOrigin: true
      },
      '/external': {
        target: 'http://cms.yinchunyu.com/external',
        changeOrigin: true
      }
    },
    // 该配置用于服务端请求转发
    routeRules: {
      '/server/**': {
        proxy: process.env.BASE_URL || 'http://101.37.70.236:4000' + '/**'
      }
    }
  },
  // 禁用 HMR
  build: {
    hotMiddleware: {
      client: {
        noInfo: true,
        reload: true
      }
    }
  }
});
