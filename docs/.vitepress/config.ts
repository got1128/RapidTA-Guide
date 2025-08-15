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
                    '/typeofaction': [
                        {
                            text: "typeofaction",
                            items: [
                                        { 
                                            text: 'Texture Testing Method Descriptions',
                                            items: [
                                                { text: '1. Adhesion Test', link: '#_1-adhesion-test' },
                                                { text: '2. Bending Test', link: '#_2-bending-test' },
                                                { text: '3. Burst Test', link: '#_3-burst-test' },
                                                { text: '4. Compression Test', link: '#_4-compression-test' },
                                                { text: '5. Creep Test', link: '#_5-creep-test' },
                                                { text: '6. Cutting Test', link: '#_6-cutting-test' },
                                                { text: '7. Extrusion Test', link: '#_7-extrusion-test' },
                                                { text: '8. Penetration Test', link: '#_8-penetration-test' },
                                                { text: '9. Relaxation Test', link: '#_9-relaxation-test' },
                                                { text: '10. Tension Test', link: '#_10-tension-test' },
                                                { text: '11. TPA Test', link: '#_11-tpa-test-texture-profile-analysis' }
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
                    '/zh/typeofaction': [
                        {
                            items: [
                                { 
                                    text: '質構測試動作說明',
                                    items: [
                                        { text: '1. 黏性測試 (Adhesion)', link: '#_1-adhesion-test-黏性測試' },
                                        { text: '2. 彎曲測試 (Bending)', link: '#_2-bending-test-彎曲測試' },
                                        { text: '3. 爆破測試 (Burst)', link: '#_3-burst-test-爆破測試' },
                                        { text: '4. 壓縮測試 (Compression)', link: '#_4-compression-test-壓縮測試' },
                                        { text: '5. 蠕變測試 (Creep)', link: '#_5-creep-test-蠕變測試' },
                                        { text: '6. 剪切測試 (Cutting)', link: '#_6-cutting-test-剪切測試' },
                                        { text: '7. 擠壓測試 (Extrusion)', link: '#_7-extrusion-test-擠壓測試' },
                                        { text: '8. 穿刺測試 (Penetration)', link: '#_8-penetration-test-穿刺測試' },
                                        { text: '9. 鬆弛測試 (Relaxation)', link: '#_9-relaxation-test-鬆弛測試' },
                                        { text: '10. 拉伸測試 (Tension)', link: '#_10-tension-test-拉伸測試' },
                                        { text: '11. TPA測試', link: '#_11-tpa-test-全質構測試' }
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
                    '/cn/typeofaction': [
                        {
                            items: [
                                        { 
                                            text: '质构测试动作说明',
                                            items: [
                                                { text: '1. 黏性测试 (Adhesion)', link: '#_1-adhesion-test-黏性测试' },
                                                { text: '2. 弯曲测试 (Bending)', link: '#_2-bending-test-弯曲测试' },
                                                { text: '3. 爆破测试 (Burst)', link: '#_3-burst-test-爆破测试' },
                                                { text: '4. 压缩测试 (Compression)', link: '#_4-compression-test-压缩测试' },
                                                { text: '5. 蠕变测试 (Creep)', link: '#_5-creep-test-蠕变测试' },
                                                { text: '6. 剪切测试 (Cutting)', link: '#_6-cutting-test-剪切测试' },
                                                { text: '7. 挤压测试 (Extrusion)', link: '#_7-extrusion-test-挤压测试' },
                                                { text: '8. 穿刺测试 (Penetration)', link: '#_8-penetration-test-穿刺测试' },
                                                { text: '9. 松弛测试 (Relaxation)', link: '#_9-relaxation-test-松弛测试' },
                                                { text: '10. 拉伸测试 (Tension)', link: '#_10-tension-test-拉伸测试' },
                                                { text: '11. TPA测试', link: '#_11-tpa-test-全质构测试' }
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