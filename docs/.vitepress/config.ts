import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'RapidTA Application Guide',
    description: 'Complete guide for texture analyzer applications',
    appearance: true,
    base: "/RapidTA-Guide/",

    locales: {
        '/': {
            lang: 'en-US',
            title: 'RapidTA Application Guide',
            description: ''
        },

        '/zh/': {
            lang: 'zh-CN',
            title: 'RapidTA Application Guide',
            description: ''
        },
        '/cn/': {
            lang: 'en-US',
            title: 'RapidTA Application Guide',
            description: ''
        }
        
    },

    themeConfig: {

        localeLinks: {
            text: 'Language',

            items: [
                { text: 'English', link: '/' },
                { text: '繁體中文', link: '/zh/' },
                { text: '简体中文', link: '/cn/' }
            ]
        },

        nav: [
            {
                text: 'Application',
                items: [
                    { text: 'food', link: '/guide/applications' },
                ]
            },
            { text: 'Accessories', link: '/guide/accessories' },
            { text: 'Video', link: '/guide/video' },
            { text: 'Type of Action', link: '/guide/typeofaction' },
            { text: 'GitHub', link: 'https://github.com/got1128/RapidTA-Guide.git' }
        ],

        sidebar: {
            '/guide/': [
                {
                    text: "",
                    items: [
                        { text: "food", link: "/guide/applications",
                            items: [
                                { text: "Bakery", link: "/guide/Bakery"},
                                { text: "Cereal", link: "/guide/Cereal"},
                                { text: "Confectionery", link: "/guide/Confectionery"},
                                { text: "Dairy", link: "/guide/Dairy"},
                                { text: "Fruit & Vegetables", link: "/guide/Fruit & vegetables"},
                            ]
                        },
                    ]
                }
            ],
            '/guide_cn/': [
                {
                    text: "",
                    items: [
                        { text: "食品", link: "/guide_cn/applications",
                            items: [
                                { text: "Bakery", link: "/guide_cn/Bakery"},
                                { text: "Cereal", link: "/guide_cn/Cereal"},
                                { text: "Confectionery", link: "/guide_cn/Confectionery"},
                                { text: "Dairy", link: "/guide_cn/Dairy"},
                                { text: "Fruit & Vegetables", link: "/guide_cn/Fruit & vegetables"},
                            ]
                        },
                        
                    ]
                }
            ],
            '/guide_zh/': [
                {
                    text: "",
                    items: [
                        { text: "食品", link: "/guide_zh/applications",
                            items: [
                                { text: "Bakery", link: "/guide_zh/Bakery"},
                                { text: "Cereal", link: "/guide_zh/Cereal"},
                                { text: "Confectionery", link: "/guide_zh/Confectionery"},
                                { text: "Dairy", link: "/guide_zh/Dairy"},
                                { text: "Fruit & Vegetables", link: "/guide_zh/Fruit & vegetables"},
                            ]
                        },
                    ]
                }
            ]
        },
            

        socialLinks: [
            { icon: 'github', link: 'https://github.com/got1128/RapidTA-Guide.git' }
        ],

        footer: {
            copyright: "Copyright © 2025 RapidTA"
        },
    }
})

