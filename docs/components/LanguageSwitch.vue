<script setup>
import { useRouter } from 'vitepress'
const router = useRouter()

const languages = [
  { text: 'English', code: 'en', path: '/' },
  { text: '繁體中文', code: 'zh-Hant', path: '/zh/' },
  { text: '简体中文', code: 'zh-CN', path: '/cn/' }
]

const currentPath = computed(() => {
  return router.route.path.replace(/^\/(zh|cn)\//, '/')
})
</script>

<template>
  <div class="language-switch">
    <a 
      v-for="lang in languages" 
      :href="lang.path + currentPath.substring(1)"
      :class="{ active: router.route.path.startsWith(lang.path) }"
    >
      {{ lang.text }}
    </a>
  </div>
</template>

<style scoped>
.language-switch {
  display: flex;
  gap: 12px;
}
.active {
  font-weight: bold;
  color: var(--vp-c-brand);
}
</style>