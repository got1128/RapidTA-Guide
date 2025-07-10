<template>
  <div class="app-container">
    <!-- 詳細展示模式 -->
    <div v-if="detailMode" class="detail-view">
      <div class="detail-header">
        <button @click="exitDetailMode" class="back-button">← 返回</button>
        <h2 class="detail-title">{{ detailItem.title }}</h2>
      </div>
      
      <div class="detail-content">
        <div class="detail-info">
          <div class="info-row">
            <span class="info-label">主分類：</span>
            <span class="info-value">{{ detailItem.mainCategory }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">子分類：</span>
            <span class="info-value">{{ detailItem.subcategory }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">子類別：</span>
            <span class="info-value">{{ detailItem.subclass }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">測試模式：</span>
            <span class="info-value">{{ detailItem.testMode }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">操作類型：</span>
            <span class="info-value">{{ detailItem.actionType }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">探針/夾具：</span>
            <span class="info-value">{{ detailItem.probe }}</span>
          </div>
        </div>
        
        <div class="detail-method">
          <h3>實驗方法詳細說明</h3>
          <div class="method-content">
            <div class="pdf-container">
              <iframe
                :src="getPdfUrl(detailItem.file)"
                class="pdf-viewer"
                frameborder="0"
                allowfullscreen
              ></iframe>
              <div class="pdf-fallback">
                <p>PDF 無法顯示？</p>
                <a :href="detailItem.file" target="_blank" class="pdf-link">
                  📄 點擊這裡在新視窗開啟 PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 一般列表模式 -->
    <div v-else class="main-view">
      <!-- 顯示當前篩選狀態 -->
      <div class="filter-status">
        <h3>🥖 fruit & vegetables 產品專區</h3>
        <p>目前顯示所有 fruit & vegetables 子分類的產品</p>
      </div>

      <!-- Debug Info -->
      <div class="debug-info">
        <h4>Debug Info:</h4>
        <p>Data Load Status: {{ loading ? 'Loading...' : 'Loaded' }}</p>
        <p>Total Records: {{ data.length }}</p>
        <p>fruit & vegetables Records: {{ filteredItems.length }}</p>
      </div>

      <!-- 搜尋框 -->
      <div class="search-section">
        <input
          v-model="searchText"
          type="text"
          placeholder="🔍 搜尋 fruit & vegetables 產品名稱或分類..."
          class="search-input"
        />
      </div>

      <!-- 篩選器 (移除 Subcategory 選擇器) -->
      <div class="filter-section">
        <select v-model="selectedSubclass" class="filter-select">
          <option value="">Subclass</option>
          <option
            v-for="subclass in subclasses"
            :key="subclass"
            :value="subclass"
          >
            {{ subclass }}
          </option>
        </select>

        <select v-model="selectedActionType" class="filter-select">
          <option value="">ActionType</option>
          <option
            v-for="actionType in actionTypes"
            :key="actionType"
            :value="actionType"
          >
            {{ actionType }}
          </option>
        </select>
      </div>

      <!-- 載入中 -->
      <div v-if="loading" class="loading-message">
        <p>載入資料中...</p>
      </div>

      <!-- 無資料 -->
      <div v-else-if="data.length === 0" class="no-data-message">
        <p>⚠️ 找不到資料，請檢查JSON檔案路徑。</p>
      </div>

      <!-- 結果列表 -->
      <div v-else class="results-grid">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="result-card"
        >
          <h3 class="card-title">{{ item.title }}</h3>
          <div class="card-info">
            <p class="info-line">📂 {{ item.mainCategory }} > {{ item.subcategory }} > {{ item.subclass }}</p>
            <p class="info-line">🔧 測試模式: {{ item.testMode }}</p>
            <p class="info-line">⚡ 操作類型: {{ item.actionType }}</p>
            <p class="info-line">🔍 探針/夾具: {{ item.probe }}</p>
          </div>

          <div class="card-actions">
            <button @click="showDetail(item)" class="detail-button">
              詳細實驗方法
            </button>
            <details class="pdf-preview">
              <summary class="preview-toggle">
                ▶ 預覽PDF
              </summary>
              <div class="pdf-container">
                <iframe
                  :src="getPdfUrl(item.file)"
                  class="preview-iframe"
                  frameborder="0"
                ></iframe>

              </div>
            </details>
          </div>
        </div>
      </div>

      <!-- 無匹配結果 -->
      <div v-if="!loading && data.length > 0 && filteredItems.length === 0" class="no-results-message">
        <p>😔 找不到符合條件的 fruit & vegetables 產品</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const data = ref([])
const searchText = ref('')
const selectedCategory = ref('')
const selectedSubcategory = ref('fruit & vegetables') // 固定為 fruit & vegetables
const selectedSubclass = ref('')
const selectedActionType = ref('')
const loading = ref(true)
const detailMode = ref(false)
const detailItem = ref(null)

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

// 只顯示 fruit & vegetables 類別的 subclasses
const subclasses = computed(() => {
  const FruitItems = data.value.filter(item => 
    item.subcategory && item.subcategory.toLowerCase() === 'fruit & vegetables'
  )
  return [...new Set(FruitItems .map((item) => item.subclass))].sort()
})

// 只顯示 fruit & vegetables 類別的 actionTypes
const actionTypes = computed(() => {
  const FruitItems  = data.value.filter(item => 
    item.subcategory && item.subcategory.toLowerCase() === 'fruit & vegetables'
  )
  return [...new Set(FruitItems .map((item) => item.actionType))].sort()
})

// 修改篩選邏輯，強制只顯示 fruit & vegetables
const filteredItems = computed(() => {
  return data.value.filter((item) => {
    const title = item.title || ''
    const mainCategory = item.mainCategory || ''
    const subcategory = item.subcategory || ''
    const subclass = item.subclass || ''
    const actionType = item.actionType || ''
    const probe = item.probe || ''
    
    // 強制只顯示 fruit & vegetables 類別
    if (subcategory.toLowerCase() !== 'fruit & vegetables') {
      return false
    }
    
    const matchesText =
      title.toLowerCase().includes(searchText.value.toLowerCase()) ||
      mainCategory.toLowerCase().includes(searchText.value.toLowerCase()) ||
      subcategory.toLowerCase().includes(searchText.value.toLowerCase()) ||
      subclass.toLowerCase().includes(searchText.value.toLowerCase()) ||
      actionType.toLowerCase().includes(searchText.value.toLowerCase()) ||
      probe.toLowerCase().includes(searchText.value.toLowerCase())

    const matchesCategory = selectedCategory.value
      ? item.mainCategory === selectedCategory.value
      : true

    const matchesSubclass = selectedSubclass.value
      ? item.subclass === selectedSubclass.value
      : true

    const matchesActionType = selectedActionType.value
      ? item.actionType === selectedActionType.value
      : true

    return matchesText && matchesCategory && matchesSubclass && matchesActionType
  })
})

// 詳細展示功能
const showDetail = (item) => {
  detailItem.value = item
  detailMode.value = true
}

const exitDetailMode = () => {
  detailMode.value = false
  detailItem.value = null
}

// PDF URL 處理函數
const getPdfUrl = (fileUrl) => {
  if (!fileUrl) return ''
  
  // 如果是相對路徑，轉換為絕對路徑
  if (fileUrl.startsWith('./') || fileUrl.startsWith('../')) {
    return fileUrl
  }
  
  // 如果是完整的 URL，直接返回
  if (fileUrl.startsWith('http')) {
    return fileUrl
  }
  
  // 使用 PDF.js viewer 來顯示 PDF（更可靠的方式）
  return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(fileUrl)}`
}
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft JhengHei', 'Segoe UI', Arial, sans-serif;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

/* 篩選狀態顯示 */
.filter-status {
  background: var(--vp-c-brand-soft);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 25px;
  border: 2px solid var(--vp-c-brand);
  text-align: center;
}

.filter-status h3 {
  margin: 0 0 10px 0;
  color: var(--vp-c-brand);
  font-size: 24px;
}

.filter-status p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 16px;
}

/* Debug Info */
.debug-info {
  background: var(--vp-c-bg-soft);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid var(--vp-c-border);
}

.debug-info h4 {
  margin: 0 0 10px 0;
  color: var(--vp-c-text-1);
  font-weight: bold;
}

.debug-info p {
  margin: 5px 0;
  color: var(--vp-c-text-2);
}

/* 搜尋區域 */
.search-section {
  margin-bottom: 25px;
}

.search-input {
  width: 100%;
  padding: 18px 25px;
  font-size: 18px;
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px var(--vp-c-brand-soft);
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

/* 篩選器區域 */
.filter-section {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 16px;
  cursor: pointer;
  transition: border-color 0.3s ease;
  min-width: 200px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.filter-select option {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 8px;
}

/* 黑暗模式支援 */
@media (prefers-color-scheme: dark) {
  .filter-select {
    background: #2d3748;
    color: #e2e8f0;
    border-color: #4a5568;
  }
  
  .filter-select option {
    background: #2d3748;
    color: #e2e8f0;
  }
  
  .filter-select:focus {
    border-color: #4CAF50;
  }
}

/* 載入和訊息 */
.loading-message,
.no-data-message,
.no-results-message {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-2);
  font-size: 18px;
}

.no-data-message {
  color: var(--vp-c-danger);
}

/* 結果網格 */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.result-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand-soft);
}

.card-title {
  color: var(--vp-c-text-1);
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 15px 0;
}

.card-info {
  margin-bottom: 15px;
}

.info-line {
  margin: 8px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.4;
}

.card-actions {
  border-top: 1px solid var(--vp-c-border);
  padding-top: 15px;
  display: flex;
  flex-direction: column;

}

.detail-button {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
  width: 100%;
}

.detail-button:hover {
  background: var(--vp-c-brand-dark);
}

.pdf-preview {
  margin-top: 10px;
}

.preview-toggle {
  color: var(--vp-c-brand);
  cursor: pointer;
  font-weight: bold;
  user-select: none;
  list-style: none;
}

.preview-toggle:hover {
  text-decoration: underline;
}

.preview-iframe {
  width: 100%;
  height: 400px;
  margin-top: 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
}

/* 詳細展示模式 */
.detail-view {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
}

.detail-header {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid var(--vp-c-border);
}

.back-button {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background: var(--vp-c-brand-dark);
}

.detail-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: var(--vp-c-text-1);
}

.detail-content {
  padding: 30px;
}

.detail-info {
  background: var(--vp-c-bg);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid var(--vp-c-border);
}

.info-row {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.info-label {
  font-weight: bold;
  color: var(--vp-c-text-1);
  min-width: 120px;
}

.info-value {
  color: var(--vp-c-text-2);
  flex: 1;
}

.detail-method h3 {
  color: var(--vp-c-text-1);
  margin: 0 0 20px 0;
  font-size: 20px;
  border-bottom: 2px solid var(--vp-c-brand);
  padding-bottom: 10px;
}

.method-content {
  background: var(--vp-c-bg);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
}

.pdf-viewer {
  width: 100%;
  height: 600px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .app-container {
    padding: 15px;
  }
  
  .search-input {
    padding: 15px 20px;
    font-size: 16px;
  }
  
  .filter-section {
    flex-direction: column;
  }
  
  .filter-select {
    min-width: 100%;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .detail-content {
    padding: 20px;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-label {
    min-width: auto;
    margin-bottom: 5px;
  }
}

/* 移除details的預設樣式 */
details > summary {
  list-style: none;
}

details > summary::-webkit-details-marker {
  display: none;
}
</style>