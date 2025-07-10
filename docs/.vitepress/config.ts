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
            description: 'Complete guide for texture analyzer applications'
        }
    },

    themeConfig: {

        nav: [
            {
                text: 'Application',
                items: [
                    { text: 'ALL', link: '/guide/applications' },
                    { text: 'Bakery', link: '/guide/Bakery' },
                    { text: 'Cereal', link: '/guide/Cereal' },
                    { text: 'Confectionery', link: '/guide/Confectionery' },
                    { text: 'Dairy', link: '/guide/Dairy' },
                    { text: 'Fruit & Vegetables', link: '/guide/Fruit & vegetables' }
                ]
            },
            { text: 'Accessories', link: '/guide/accessories' },
            { text: 'Video', link: '/guide/video' },
            { text: 'Type of Action', link: '/guide/typeofaction' },
            { text: 'GitHub', link: 'https://github.com/got1128/RapidTA-Guide.git' }
        ],

        sidebar: {
            '/guide/applications': [
                {
                    text: "RapidTA Guide",
                    items: [
                        { text: "ALL", link: "/guide/applications"},
                        { text: "Bakery", link: "/guide/Bakery"},
                        { text: "Cereal", link: "/guide/Cereal"},
                        { text: "Confectionery", link: "/guide/Confectionery"},
                        { text: "Dairy", link: "/guide/Dairy"},
                        { text: "Fruit & Vegetables", link: "/guide/Fruit & vegetables"},
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

