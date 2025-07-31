import DefaultTheme from 'vitepress/theme'
import ApplicationGuide_zh from '../../components/ApplicationGuide_zh.vue'
import ApplicationGuide_en from '../../components/ApplicationGuide_en.vue'
import ApplicationGuide_cn from '../../components/ApplicationGuide_cn.vue'
import PasswordProtection from '../../components/PasswordProtection.vue'
import ApplicationGuide_en_bakery from '../../components/ApplicationGuide_en_bakery.vue'
import ApplicationGuide_en_cereal from '../../components/ApplicationGuide_en_Cereal.vue'
import ApplicationGuide_en_confectionery from '../../components/ApplicationGuide_en_confectionery.vue'
import ApplicationGuide_en_dairy from '../../components/ApplicationGuide_en_dairy.vue'
import ApplicationGuide_en_Fruitvegetables from '../../components/ApplicationGuide_en_fruitvegetables.vue'
import { withBase } from 'vitepress'
import LanguageSwitch from '../../components/LanguageSwitch.vue'

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
        app.component('ApplicationGuide_en_bakery', ApplicationGuide_en_bakery)
        app.component('ApplicationGuide_en_Cereal', ApplicationGuide_en_cereal)
        app.component('ApplicationGuide_en_confectionery', ApplicationGuide_en_confectionery)
        app.component('ApplicationGuide_en_dairy', ApplicationGuide_en_dairy)
        app.component('ApplicationGuide_en_Fruitvegetables', ApplicationGuide_en_Fruitvegetables)
        app.component('LanguageSwitch', LanguageSwitch)
    }
}