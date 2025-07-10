import DefaultTheme from 'vitepress/theme'
import ApplicationGuide from '../../components/ApplicationGuide.vue'
import ApplicationGuide_en from '../../components/ApplicationGuide_en.vue'
import PasswordProtection from '../../components/PasswordProtection.vue'
import ApplicationGuide_en_bakery from '../../components/ApplicationGuide_en_bakery.vue'
import ApplicationGuide_en_cereal from '../../components/ApplicationGuide_en_Cereal.vue'
import ApplicationGuide_en_confectionery from '../../components/ApplicationGuide_en_confectionery.vue'
import ApplicationGuide_en_dairy from '../../components/ApplicationGuide_en_dairy.vue'
import ApplicationGuide_en_Fruitvegetables from '../../components/ApplicationGuide_en_fruitvegetables.vue'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('ApplicationGuide', ApplicationGuide)
        app.component('ApplicationGuide_en', ApplicationGuide_en)
        app.component('PasswordProtection', PasswordProtection)
        app.component('ApplicationGuide_en_bakery', ApplicationGuide_en_bakery)
        app.component('ApplicationGuide_en_Cereal', ApplicationGuide_en_cereal)
        app.component('ApplicationGuide_en_confectionery', ApplicationGuide_en_confectionery)
        app.component('ApplicationGuide_en_dairy', ApplicationGuide_en_dairy)
        app.component('ApplicationGuide_en_Fruitvegetables', ApplicationGuide_en_Fruitvegetables)
    }
}