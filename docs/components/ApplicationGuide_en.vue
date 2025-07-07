<template>
  <div class="space-y-6">
    <!-- Debug Info -->
    <div class="bg-gray-100 p-4 rounded mb-4">
      <h4 class="font-bold">Debug Info:</h4>
      <p>Data Load Status: {{ loading ? 'Loading...' : 'Loaded' }}</p>
      <p>Total Records: {{ data.length }}</p>
      <p>Filtered Records: {{ filteredItems.length }}</p>
    </div>

    <!-- Search Field -->
    <input
      v-model="searchText"
      type="text"
      placeholder="🔍 Search by title or category..."
      class="w-full p-2 border border-gray-300 rounded shadow"
    />

    <!-- Filter Dropdowns -->
    <div class="flex flex-wrap gap-4">
      <select v-model="selectedCategory" class="p-2 border rounded">
        <option value="">All Main Categories</option>
        <option
          v-for="category in mainCategories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>

      <select v-model="selectedSubcategory" class="p-2 border rounded">
        <option value="">All Subcategories</option>
        <option
          v-for="subcategory in subcategories"
          :key="subcategory"
          :value="subcategory"
        >
          {{ subcategory }}
        </option>
      </select>

      <select v-model="selectedActionType" class="p-2 border rounded">
        <option value="">All Action Types</option>
        <option
          v-for="actionType in actionTypes"
          :key="actionType"
          :value="actionType"
        >
          {{ actionType }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p>Loading data...</p>
    </div>

    <!-- No Data -->
    <div v-else-if="data.length === 0" class="text-center py-8">
      <p class="text-red-600">⚠️ No data found. Please check the JSON file path.</p>
    </div>

    <!-- Results -->
    <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="border rounded-lg shadow bg-white p-4"
      >
        <h3 class="text-lg font-bold text-blue-700">{{ item.title }}</h3>
        <div class="text-sm text-gray-600 space-y-1">
          <p>📂 {{ item.mainCategory }} > {{ item.subcategory }} > {{ item.subclass }}</p>
          <p>🔧 Test Mode: {{ item.testMode }}</p>
          <p>⚡ Action Type: {{ item.actionType }}</p>
          <p>🔍 Probe/Fixture: {{ item.probe }}</p>
        </div>

        <details class="mt-2">
          <summary class="text-blue-500 cursor-pointer hover:underline">
            ▶ Click to Preview PDF
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

    <!-- No Matching Results -->
    <div v-if="!loading && data.length > 0 && filteredItems.length === 0" class="text-center py-8">
      <p class="text-gray-600">😔 No matching results found</p>
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
    console.log('🔄 Starting to load JSON...')
    const res = await fetch('../data/applications.json')
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    
    const json = await res.json()
    console.log('✅ Successfully loaded JSON:', json)
    console.log('📊 Number of records:', json.length)
    
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
    
    console.log('🔄 Transformed data:', transformedData)
    data.value = transformedData
    loading.value = false
  } catch (e) {
    console.error('❌ Failed to load JSON:', e)
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
