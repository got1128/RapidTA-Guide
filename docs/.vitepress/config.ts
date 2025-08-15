import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'RapidTA Application Guide',
    description: 'Complete guide for texture analyzer applications',
    appearance: true,
    base: "/RapidTA-Guide/",

    locales: {
        root: {
            label: 'English',
            lang: 'en-US',
            title: 'RapidTA Application Guide',
            description: 'Complete guide for texture analyzer applications',
            themeConfig: {
                // 英文版導航
                nav: [
                    {
                        text: 'Application',
                        items: [
                            { text: 'Food', link: '/guide/applications' },
                        ]
                    },
                    { text: 'Accessories', link: '/accessories' },
                    { text: 'Video', link: '/video' },
                    { text: 'Type of Action', link: '/typeofaction' },
                    { text: 'GitHub', link: 'https://github.com/got1128/RapidTA-Guide.git' }
                ],

                sidebar: {
                    '/guide/': [
                        {
                            text: "Applications",
                            items: [
                                { 
                                    text: "Food", 
                                    link: "/guide/applications",
                                    items: [
                                        { text: "Bakery", link: "/guide/bakery"},
                                        { text: "Cereal", link: "/guide/cereal"},
                                        { text: "Confectionery", link: "/guide/confectionery"},
                                        { text: "Dairy", link: "/guide/dairy"},
                                        { text: "Fruit & Vegetables", link: "/guide/fruit-vegetables"},
                                    ]
                                },
                            ]
                        }
                    ]
                }
            }
        },
        zh: {
            label: '繁體中文',
            lang: 'zh-Hant',
            title: 'RapidTA 中文使用指南',
            description: 'RapidTA 質地分析儀完整應用指南',
            themeConfig: {
                // 繁體中文導航
                nav: [
                    {
                        text: '應用領域',
                        items: [
                            { text: '食品', link: '/zh/guide/applications' },
                        ]
                    },
                    { text: '配件', link: '/zh/accessories' },
                    { text: '影片', link: '/zh/video' },
                    { text: '動作類型', link: '/zh/typeofaction' },
                    { text: 'GitHub', link: 'https://github.com/got1128/RapidTA-Guide.git' }
                ],

                sidebar: {
                    '/zh/guide/': [
                        {
                            text: "應用領域",
                            items: [
                                { 
                                    text: "食品", 
                                    link: "/zh/guide/applications",
                                    items: [
                                        { text: "烘焙", link: "/zh/guide/bakery"},
                                        { text: "穀物", link: "/zh/guide/cereal"},
                                        { text: "糖果", link: "/zh/guide/confectionery"},
                                        { text: "乳製品", link: "/zh/guide/dairy"},
                                        { text: "果蔬", link: "/zh/guide/fruit-vegetables"},
                                    ]
                                },
                            ]
                        }
                    ]
                }
            }
        },
        cn: {
            label: '简体中文',
            lang: 'zh-CN',
            title: 'RapidTA 简体中文指南',
            description: 'RapidTA 质地分析仪完整应用指南',
            themeConfig: {
                // 简体中文导航
                nav: [
                    {
                        text: '应用领域',
                        items: [
                            { text: '食品', link: '/cn/guide/applications' },
                        ]
                    },
                    { text: '配件', link: '/cn/accessories' },
                    { text: '视频', link: '/cn/video' },
                    { text: '动作类型', link: '/cn/typeofaction' },
                    { text: 'GitHub', link: 'https://github.com/got1128/RapidTA-Guide.git' }
                ],

                sidebar: {
                    '/cn/guide/': [
                        {
                            text: "应用领域",
                            items: [
                                { 
                                    text: "食品", 
                                    link: "/cn/guide/applications",
                                    items: [
                                        { text: "烘焙", link: "/cn/guide/bakery"},
                                        { text: "谷物", link: "/cn/guide/cereal"},
                                        { text: "糖果", link: "/cn/guide/confectionery"},
                                        { text: "乳制品", link: "/cn/guide/dairy"},
                                        { text: "果蔬", link: "/cn/guide/fruit-vegetables"},
                                    ]
                                },
                            ]
                        }
                    ]
                }
            }
        }
    },

    themeConfig: {
        // 全域設定
        socialLinks: [
            { icon: 'github', link: 'https://github.com/got1128/RapidTA-Guide.git' }
        ],

        footer: {
            copyright: "Copyright © 2025 RapidTA"
        },

        // 語言切換選單
        langMenuLabel: 'Language'
    }
})