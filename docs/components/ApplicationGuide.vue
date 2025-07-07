<template>
  <div class="space-y-6">
    <!-- 調試信息 -->
    <div class="bg-gray-100 p-4 rounded mb-4">
      <h4 class="font-bold">調試信息:</h4>
      <p>數據載入狀態: {{ loading ? '載入中...' : '已載入' }}</p>
      <p>總筆數: {{ data.length }}</p>
      <p>過濾後筆數: {{ filteredItems.length }}</p>
    </div>

    <!-- 搜尋欄位 -->
    <input
      v-model="searchText"
      type="text"
      placeholder="🔍 搜尋應用標題或分類..."
      class="w-full p-2 border border-gray-300 rounded shadow"
    />

    <!-- 分類選單 -->
    <div class="flex flex-wrap gap-4">
      <select v-model="selectedCategory" class="p-2 border rounded">
        <option value="">全部類別</option>
        <option
          v-for="category in mainCategories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
      
      <select v-model="selectedSubcategory" class="p-2 border rounded">
        <option value="">全部子類別</option>
        <option
          v-for="subcategory in subcategories"
          :key="subcategory"
          :value="subcategory"
        >
          {{ subcategory }}
        </option>
      </select>
      
      <select v-model="selectedActionType" class="p-2 border rounded">
        <option value="">全部動作類型</option>
        <option
          v-for="actionType in actionTypes"
          :key="actionType"
          :value="actionType"
        >
          {{ actionType }}
        </option>
      </select>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-8">
      <p>正在載入數據...</p>
    </div>

    <!-- 無數據提示 -->
    <div v-else-if="data.length === 0" class="text-center py-8">
      <p class="text-red-600">⚠️ 沒有找到任何數據，請檢查 JSON 文件路徑</p>
    </div>

    <!-- 結果區 -->
    <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="border rounded-lg shadow bg-white p-4"
      >
        <h3 class="text-lg font-bold text-blue-700">{{ item.title }}</h3>
        <div class="text-sm text-gray-600 space-y-1">
          <p>📂 {{ item.mainCategory }} > {{ item.subcategory }} > {{ item.subclass }}</p>
          <p>🔧 測試模式: {{ item.testMode }}</p>
          <p>⚡ 動作類型: {{ item.actionType }}</p>
          <p>🔍 探針/夾具: {{ item.probe }}</p>
        </div>

        <details class="mt-2">
          <summary class="text-blue-500 cursor-pointer hover:underline">
            ▶ 點我預覽 PDF
          </summary>
          <iframe
            :src="item.file"
            width="100%"
            height="500"
            class="mt-2 rounded border"
          ></iframe>
        </details>
      </div>
    </div>

    <!-- 無匹配結果 -->
    <div v-if="!loading && data.length > 0 && filteredItems.length === 0" class="text-center py-8">
      <p class="text-gray-600">😔 沒有找到符合條件的結果</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const data = ref([])
const searchText = ref('')
const selectedCategory = ref('')
const selectedSubcategory = ref('')
const selectedActionType = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    console.log('🔄 開始載入 JSON...')
    const res = await fetch('../data/applications.json');
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    
    const json = await res.json()
    console.log('✅ 成功載入 JSON：', json)
    console.log('📊 數據筆數：', json.length)
    
    // 轉換數據格式以匹配組件期望的結構
    const transformedData = json.map(item => ({
      id: item.ID,
      title: item.Products,
      mainCategory: item['Main Category'],
      subcategory: item.Subcategory,
      subclass: item.Subclass,
      testMode: item['Test mode'],
      actionType: item['Type of action'],
      probe: item['Probe or Fixture'],
      file: item.file
    }))
    
    console.log('🔄 轉換後的數據：', transformedData)
    data.value = transformedData
    loading.value = false
  } catch (e) {
    console.error('❌ JSON 載入失敗:', e)
    loading.value = false
  }
})

const mainCategories = computed(() => {
  return [...new Set(data.value.map((item) => item.mainCategory))].sort()
})

const subcategories = computed(() => {
  return [...new Set(data.value.map((item) => item.subcategory))].sort()
})

const actionTypes = computed(() => {
  return [...new Set(data.value.map((item) => item.actionType))].sort()
})

const filteredItems = computed(() => {
  return data.value.filter((item) => {
    // 確保屬性存在且為字符串
    const title = item.title || ''
    const mainCategory = item.mainCategory || ''
    const subcategory = item.subcategory || ''
    const actionType = item.actionType || ''
    const probe = item.probe || ''
    
    const matchesText =
      title.toLowerCase().includes(searchText.value.toLowerCase()) ||
      mainCategory.toLowerCase().includes(searchText.value.toLowerCase()) ||
      subcategory.toLowerCase().includes(searchText.value.toLowerCase()) ||
      actionType.toLowerCase().includes(searchText.value.toLowerCase()) ||
      probe.toLowerCase().includes(searchText.value.toLowerCase())

    const matchesCategory = selectedCategory.value
      ? item.mainCategory === selectedCategory.value
      : true
      
    const matchesSubcategory = selectedSubcategory.value
      ? item.subcategory === selectedSubcategory.value
      : true
      
    const matchesActionType = selectedActionType.value
      ? item.actionType === selectedActionType.value
      : true

    return matchesText && matchesCategory && matchesSubcategory && matchesActionType
  })
})
</script>

<style scoped>
details > summary {
  list-style: none;
}
</style>