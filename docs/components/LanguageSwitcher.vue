<script setup>
import { useRouter, useData, withBase } from 'vitepress'
import { computed } from 'vue'

const { route } = useRouter()
const { site } = useData()

const currentPath = computed(() => route.path)

// 語言選項定義
const languages = [
  { label: 'English', prefix: '/' },
  { label: '繁體中文', prefix: '/zh/' },
  { label: '简体中文', prefix: '/cn/' }
]

// 取得當前語系 prefix
const currentLang = computed(() => {
  const path = currentPath.value
  if (path.startsWith('/zh/')) return '/zh/'
  if (path.startsWith('/cn/')) return '/cn/'
  return '/'
})

// 切換語言邏輯
function switchLanguage(toPrefix) {
  const oldPrefix = currentLang.value
  const newPath = currentPath.value.replace(oldPrefix, toPrefix)
  location.href = withBase(newPath) // 加上 base，自動正確跳轉
}
</script>

<template>
  <select @change="switchLanguage($event.target.value)" class="border rounded px-2 py-1">
    <option v-for="lang in languages" :key="lang.prefix" :value="lang.prefix" :selected="lang.prefix === currentLang">
      {{ lang.label }}
    </option>
  </select>
</template>
