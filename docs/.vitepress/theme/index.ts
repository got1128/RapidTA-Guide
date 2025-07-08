import DefaultTheme from 'vitepress/theme'
import ApplicationGuide from '../../components/ApplicationGuide.vue'
import ApplicationGuide_en from '../../components/ApplicationGuide_en.vue'



export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('ApplicationGuide', ApplicationGuide)
        app.component('ApplicationGuide_en', ApplicationGuide_en)
    }

}