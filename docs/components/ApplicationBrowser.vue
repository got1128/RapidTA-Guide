<template>
  <div class="application-browser">
    <!-- 側邊欄 -->
    <aside class="sidebar" :class="{ 'sidebar--collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <button @click="toggleSidebar" class="sidebar-toggle">
          {{ sidebarCollapsed ? '☰' : '✕' }}
        </button>
        <h2 v-if="!sidebarCollapsed" class="sidebar-title">Categories</h2>
      </div>
      
      <nav v-if="!sidebarCollapsed" class="sidebar-nav">
        <div class="sidebar-section">
          <h3>Quick Filters</h3>
          <div class="filter-group">
            <label class="filter-label">
              <input 
                type="checkbox" 
                v-model="showFavoritesOnly"
                class="filter-checkbox"
              />
              ⭐ Favorites Only
            </label>
          </div>
        </div>
        
        <div class="sidebar-section">
          <h3>Categories</h3>
          <div class="category-tree">
            <div 
              v-for="category in categoriesTree" 
              :key="category.name"
              class="category-item"
            >
              <div 
                class="category-header"
                @click="toggleCategory(category.name)"
              >
                <span class="category-icon">
                  {{ category.expanded ? '📂' : '📁' }}
                </span>
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">({{ category.count }})</span>
              </div>
              
              <div v-if="category.expanded" class="subcategory-list">
                <div 
                  v-for="subcategory in category.subcategories"
                  :key="subcategory.name"
                  class="subcategory-item"
                  @click="selectSubcategory(category.name, subcategory.name)"
                  :class="{ 'subcategory-item--active': selectedSubcategory === subcategory.name }"
                >
                  <span class="subcategory-name">{{ subcategory.name }}</span>
                  <span class="subcategory-count">({{ subcategory.count }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>

    <!-- 主內容區 -->
    <main class="main-content" :class="{ 'main-content--full': sidebarCollapsed }">
      <div class="content-header">
        <h1>Application Browser</h1>
        <div class="header-actions">
          <button @click="toggleViewMode" class="view-toggle">
            {{ viewMode === 'grid' ? '📋' : '⊞' }}
          </button>
          <button @click="exportData" class="export-btn">📤 Export</button>
        </div>
      </div>

      <!-- Debug Info -->
      <div class="debug-info" v-if="showDebug">
        <h4>Debug Info:</h4>
        <p>Data Load Status: {{ loading ? 'Loading...' : 'Loaded' }}</p>
        <p>Total Records: {{ data.length }}</p>
        <p>Filtered Records: {{ filteredItems.length }}</p>
        <p>View Mode: {{ viewMode }}</p>
      </div>

      <!-- Search Field -->
      <div class="search-container">
        <input
          v-model="searchText"
          type="text"
          placeholder="🔍 Search by title, category, or probe..."
          class="search-input"
        />
        <button @click="clearSearch" class="search-clear" v-if="searchText">
          ✕
        </button>
      </div>

      <!-- Filter Dropdowns -->
      <div class="filters-container">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">All Main Categories</option>
          <option
            v-for="category in mainCategories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>

        <select v-model="selectedActionType" class="filter-select">
          <option value="">All Action Types</option>
          <option
            v-for="actionType in actionTypes"
            :key="actionType"
            :value="actionType"
          >
            {{ actionType }}
          </option>
        </select>

        <button @click="clearFilters" class="clear-filters">
          🔄 Clear Filters
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading applications...</p>
      </div>

      <!-- No Data -->
      <div v-else-if="data.length === 0" class="no-data">
        <p>⚠️ No data found. Please check the JSON file path.</p>
      </div>

      <!-- Results -->
      <div v-else class="results-container">
        <div class="results-header">
          <span class="results-count">{{ filteredItems.length }} applications found</span>
          <div class="sort-controls">
            <label>Sort by:</label>
            <select v-model="sortBy" class="sort-select">
              <option value="title">Title</option>
              <option value="mainCategory">Category</option>
              <option value="testMode">Test Mode</option>
            </select>
          </div>
        </div>

        <div :class="[
          'results-grid',
          viewMode === 'list' ? 'results-grid--list' : 'results-grid--grid'
        ]">
          <div
            v-for="item in sortedItems"
            :key="item.id"
            class="result-card"
            :class="{ 'result-card--favorite': favorites.includes(item.id) }"
          >
            <div class="card-header">
              <h3 class="card-title">{{ item.title }}</h3>
              <button 
                @click="toggleFavorite(item.id)"
                class="favorite-btn"
                :class="{ 'favorite-btn--active': favorites.includes(item.id) }"
              >
                {{ favorites.includes(item.id) ? '⭐' : '☆' }}
              </button>
            </div>
            
            <div class="card-info">
              <div class="info-item">
                <span class="info-label">📂 Category:</span>
                <span class="info-value">{{ item.mainCategory }} > {{ item.subcategory }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">🔧 Test Mode:</span>
                <span class="info-value">{{ item.testMode }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">⚡ Action Type:</span>
                <span class="info-value">{{ item.actionType }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">🔍 Probe:</span>
                <span class="info-value">{{ item.probe }}</span>
              </div>
            </div>

            <div class="card-actions">
              <button 
                @click="togglePreview(item.id)"
                class="preview-btn"
              >
                {{ previewingItems.includes(item.id) ? '📄 Hide PDF' : '📄 Preview PDF' }}
              </button>
              <button @click="openPDF(item.file)" class="open-btn">
                🔗 Open PDF
              </button>
            </div>

            <div v-if="previewingItems.includes(item.id)" class="pdf-preview">
              <iframe
                :src="item.file"
                class="pdf-iframe"
                @load="onPDFLoad"
                @error="onPDFError"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <!-- No Matching Results -->
      <div v-if="!loading && data.length > 0 && filteredItems.length === 0" class="no-results">
        <p>😔 No matching results found</p>
        <button @click="clearFilters" class="clear-filters">Clear all filters</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// 響應式資料
const data = ref([])
const searchText = ref('')
const selectedCategory = ref('')
const selectedSubcategory = ref('')
const selectedActionType = ref('')
const loading = ref(true)
const favorites = ref([])
const previewingItems = ref([])
const sidebarCollapsed = ref(false)
const viewMode = ref('grid') // 'grid' or 'list'
const sortBy = ref('title')
const showDebug = ref(false)
const showFavoritesOnly = ref(false)

// 分類樹狀結構
const categoriesTree = ref([])

// 掛載時載入資料
onMounted(async () => {
  try {
    console.log('🔄 Starting to load JSON...')
    const res = await fetch('../data/applications.json')
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    
    const json = await res.json()
    console.log('✅ Successfully loaded JSON:', json)
    
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
    
    data.value = transformedData
    buildCategoriesTree()
    loadFavorites()
    loading.value = false
  } catch (e) {
    console.error('❌ Failed to load JSON:', e)
    loading.value = false
  }
})

// 建立分類樹狀結構
const buildCategoriesTree = () => {
  const categoryMap = new Map()
  
  data.value.forEach(item => {
    if (!categoryMap.has(item.mainCategory)) {
      categoryMap.set(item.mainCategory, new Map())
    }
    
    const subcategoryMap = categoryMap.get(item.mainCategory)
    if (!subcategoryMap.has(item.subcategory)) {
      subcategoryMap.set(item.subcategory, 0)
    }
    subcategoryMap.set(item.subcategory, subcategoryMap.get(item.subcategory) + 1)
  })
  
  categoriesTree.value = Array.from(categoryMap.entries()).map(([categoryName, subcategories]) => {
    const subcategoryList = Array.from(subcategories.entries()).map(([subName, count]) => ({
      name: subName,
      count
    }))
    
    return {
      name: categoryName,
      expanded: false,
      count: subcategoryList.reduce((sum, sub) => sum + sub.count, 0),
      subcategories: subcategoryList
    }
  })
}

// 計算屬性
const mainCategories = computed(() => {
  return [...new Set(data.value.map(item => item.mainCategory))].sort()
})

const actionTypes = computed(() => {
  return [...new Set(data.value.map(item => item.actionType))].sort()
})

const filteredItems = computed(() => {
  return data.value.filter(item => {
    const matchesText = Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchText.value.toLowerCase())
    )
    
    const matchesCategory = selectedCategory.value
      ? item.mainCategory === selectedCategory.value
      : true
    
    const matchesSubcategory = selectedSubcategory.value
      ? item.subcategory === selectedSubcategory.value
      : true
    
    const matchesActionType = selectedActionType.value
      ? item.actionType === selectedActionType.value
      : true
    
    const matchesFavorites = showFavoritesOnly.value
      ? favorites.value.includes(item.id)
      : true
    
    return matchesText && matchesCategory && matchesSubcategory && matchesActionType && matchesFavorites
  })
})

const sortedItems = computed(() => {
  return [...filteredItems.value].sort((a, b) => {
    const aValue = a[sortBy.value] || ''
    const bValue = b[sortBy.value] || ''
    return aValue.localeCompare(bValue)
  })
})

// 方法
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleCategory = (categoryName) => {
  const category = categoriesTree.value.find(cat => cat.name === categoryName)
  if (category) {
    category.expanded = !category.expanded
  }
}

const selectSubcategory = (categoryName, subcategoryName) => {
  selectedCategory.value = categoryName
  selectedSubcategory.value = subcategoryName
}

const toggleFavorite = (id) => {
  const index = favorites.value.indexOf(id)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(id)
  }
  saveFavorites()
}

const togglePreview = (id) => {
  const index = previewingItems.value.indexOf(id)
  if (index > -1) {
    previewingItems.value.splice(index, 1)
  } else {
    previewingItems.value.push(id)
  }
}

const openPDF = (url) => {
  window.open(url, '_blank')
}

const clearSearch = () => {
  searchText.value = ''
}

const clearFilters = () => {
  selectedCategory.value = ''
  selectedSubcategory.value = ''
  selectedActionType.value = ''
  searchText.value = ''
  showFavoritesOnly.value = false
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const exportData = () => {
  const dataStr = JSON.stringify(filteredItems.value, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  
  const exportFileDefaultName = 'applications-export.json'
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

const saveFavorites = () => {
  // 因為不能使用 localStorage，這裡只是示意
  console.log('Saving favorites:', favorites.value)
}

const loadFavorites = () => {
  // 因為不能使用 localStorage，這裡只是示意
  console.log('Loading favorites...')
}

const onPDFLoad = () => {
  console.log('PDF loaded successfully')
}

const onPDFError = () => {
  console.error('Failed to load PDF')
}

// 監聽搜索變化
watch(searchText, (newValue) => {
  console.log('Search text changed:', newValue)
})
</script>

<style scoped>
/* 主要佈局 */
.application-browser {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
}

/* 側邊欄樣式 */
.sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid #e0e0e0;
  transition: width 0.3s ease;
  overflow-y: auto;
}

.sidebar--collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sidebar-toggle {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
}

.sidebar-title {
  font-size: 1.1rem;
  margin: 0;
}

.sidebar-nav {
  padding: 1rem;
}

.sidebar-section {
  margin-bottom: 1.5rem;
}

.sidebar-section h3 {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.filter-group {
  margin-bottom: 1rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.category-tree {
  max-height: 400px;
  overflow-y: auto;
}

.category-item {
  margin-bottom: 0.5rem;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.category-header:hover {
  background: #f0f0f0;
}

.category-count {
  color: #666;
  font-size: 0.8rem;
  margin-left: auto;
}

.subcategory-list {
  margin-left: 1.5rem;
  margin-top: 0.5rem;
}

.subcategory-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.subcategory-item:hover {
  background: #f0f0f0;
}

.subcategory-item--active {
  background: #e3f2fd;
  color: #1976d2;
}

.subcategory-count {
  color: #666;
  font-size: 0.8rem;
  margin-left: auto;
}

/* 主內容區 */
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

.main-content--full {
  margin-left: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.content-header h1 {
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.view-toggle, .export-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.view-toggle:hover, .export-btn:hover {
  background: #f0f0f0;
}

/* 調試信息 */
.debug-info {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

/* 搜索框 */
.search-container {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

/* 過濾器 */
.filters-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.clear-filters {
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 載入中 */
.loading {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 結果區域 */
.results-container {
  margin-top: 1rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.results-count {
  font-weight: bold;
  color: #666;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-select {
  padding: 0.3rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.results-grid {
  display: grid;
  gap: 1rem;
}

.results-grid--grid {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.results-grid--list {
  grid-template-columns: 1fr;
}

.result-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.result-card:hover {
  transform: translateY(-2px);
}

.result-card--favorite {
  border-left: 4px solid #ffc107;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-title {
  margin: 0;
  color: #1976d2;
  font-size: 1.1rem;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn--active {
  color: #ffc107;
}

.card-info {
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  margin-bottom: 0.5rem;
}

.info-label {
  min-width: 120px;
  font-weight: bold;
  color: #666;
}

.info-value {
  flex: 1;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.preview-btn, .open-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
  font-size: 0.9rem;
}

.preview-btn:hover, .open-btn:hover {
  background: #f0f0f0;
}

.pdf-preview {
  margin-top: 1rem;
}

.pdf-iframe {
  width: 100%;
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* 無結果 */
.no-data, .no-results {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .application-browser {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    max-height: 300px;
  }
  
  .sidebar--collapsed {
    height: 60px;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .filters-container {
    flex-direction: column;
  }
  
  .results-grid--grid {
    grid-template-columns: 1fr;
  }
}
</style>
*/