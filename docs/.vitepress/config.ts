import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'RapidTA 應用指南',
    description: '質地分析儀應用方法大全',
    appearance: true,
    base: "/RapidTA-Guide/",

    locales: {
        root: {
            label: '繁體中文',
            lang: 'zh-TW',
            title: 'RapidTA 應用指南',
            description: '質地分析儀應用方法大全'
        }
    },

    themeConfig: {
        nav: [
            { text: 'applications', link: '/guide/applications' },
            { text: 'accessories', link: '/guide/accessories' },
            { text: 'video', link: '/guide/video' },
            { text: 'typeofaction', link: '/guide/typeofaction' },
            { text: 'GitHub', link: 'https://github.com/got1128/RapidTA-Guide.git' }
        ],

        sidebar: {

        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/got1128/RapidTA-Guide.git' }
        ],


    }
})