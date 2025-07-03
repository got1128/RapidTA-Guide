import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'RapidTA 使用指南',
    description: '應用方法大全',
    appearance: true,
    base: "/RapidTA-Guide/",

    locales: {
        root: {
            label: '繁體中文',
            lang: 'zh-TW',
            title: 'RTA 使用指南',
            description: '快速建立線上文檔的最佳解法'
        },
        '/zh-CN/': {
            label: '简体中文',
            lang: 'zh-CN',
            title: 'RTA 使用指南',
            description: '快速建立线上文档的最佳方式'
        },
        '/en/': {
            label: 'English',
            lang: 'en-US',
            title: 'RTA User Guide',
            description: 'The fastest way to build online documentation'
        }
    },

    themeConfig: {
        logo: '/images/LOGO_RapidTA.png',

        nav: [
            { text: '首頁', link: '/' },
            { text: '使用指南', link: '/guide/' },
            { text: 'GitHub', link: 'https://github.com/got1128/RapidTA-Guide.git' }
        ],

        sidebar: {
            '/guide/': [
                {
                    text: '快速開始',
                    items: [
                        { text: '安裝與啟動', link: '/guide/' },
                        { text: '常見問題', link: '/guide/faq' }
                    ]
                }
            ]
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/got1128/RapidTA-Guide.git' }
        ]
    }
})
