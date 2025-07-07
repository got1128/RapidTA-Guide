import DefaultTheme from 'vitepress/theme'
import ApplicationGuide from '../../components/ApplicationGuide.vue'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('ApplicationGuide', ApplicationGuide)
    }
}