import DefaultTheme from 'vitepress/theme'
import ApplicationGuide_zh from '../../components/ApplicationGuide_zh.vue'
import ApplicationGuide_en from '../../components/ApplicationGuide_en.vue'
import ApplicationGuide_cn from '../../components/ApplicationGuide_cn.vue'
import PasswordProtection from '../../components/PasswordProtection.vue'
import { withBase } from 'vitepress'


const links = [
  { text: 'English', link: withBase('/') },
  { text: '繁體中文', link: withBase('/zh/') },
  { text: '简体中文', link: withBase('/cn/') },
]


export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('ApplicationGuide_zh', ApplicationGuide_zh)
        app.component('ApplicationGuide_en', ApplicationGuide_en)
        app.component('ApplicationGuide_cn', ApplicationGuide_cn)
        app.component('PasswordProtection', PasswordProtection)

    }
}