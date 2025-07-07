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
            { text: '首頁', link: '/' },
            { text: '應用指南', link: '/guide/applications' },
            { text: 'GitHub', link: 'https://github.com/got1128/RapidTA-Guide.git' }
        ],

        sidebar: {
            '/guide/': [
                {
                    text: '📘 應用指南',
                    collapsed: false,
                    items: [
                        { text: '總覽', link: '/guide/applications' },
                        {
                            text: '🍞 食品類',

                            items: [
                                {
                                    text: '烘焙食品',

                                    items: [
                                        { text: '烘焙油脂', link: '/guide/food/bakery/fats' },
                                        { text: '餅乾/曲奇', link: '/guide/food/bakery/cookies' },
                                        { text: '餅乾切割測試', link: '/guide/food/bakery/cutting' },
                                        { text: '巧克力威化餅', link: '/guide/food/bakery/wafer' },
                                        { text: '餅乾彎曲測試', link: '/guide/food/bakery/bending' }
                                    ]
                                }
                            ]
                        },
                        {
                            text: '🔧 測試方法',

                            items: [
                                { text: '擠壓測試', link: '/guide/methods/extrusion' },
                                { text: '穿透測試', link: '/guide/methods/penetration' },
                                { text: '切割測試', link: '/guide/methods/cutting' },
                                { text: '彎曲測試', link: '/guide/methods/bending' }
                            ]
                        },
                        {
                            text: '🔍 探針與夾具',

                            items: [
                                { text: '前向擠壓夾具', link: '/guide/probes/forward-extrusion' },
                                { text: '圓柱探針', link: '/guide/probes/cylinder' },
                                { text: 'Warner Bratzler 刀片', link: '/guide/probes/warner-bratzler' },
                                { text: '三點彎曲夾具', link: '/guide/probes/three-point-bending' }
                            ]
                        }
                    ]
                }
            ]
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/got1128/RapidTA-Guide.git' }
        ],


    }
})