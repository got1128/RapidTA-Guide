import DefaultTheme from 'vitepress/theme'
import ApplicationGuide from '../../components/ApplicationGuide.vue'
import ApplicationGuide_en from '../../components/ApplicationGuide_en.vue'
import PasswordProtection from '../../components/PasswordProtection.vue'
import ApplicationGuide_en_bakery from '../../components/ApplicationGuide_en_bakery.vue'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('ApplicationGuide', ApplicationGuide)
        app.component('ApplicationGuide_en', ApplicationGuide_en)
        app.component('PasswordProtection', PasswordProtection)
        app.component('ApplicationGuide_en_bakery', ApplicationGuide_en_bakery)
    }
}