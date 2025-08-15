<template>
  <div class="subcategory-classifier">
    <!-- 頭部控制區 -->
    <div class="header-controls">
      <div class="search-section">
        <input
          v-model="searchText"
          type="text"
          placeholder="🔍 搜尋分類或產品..."
          class="search-input"
        />
      </div>
      
    </div>

    
    <!-- 載入狀態 -->
    <div v-if="loading" class="loading">
      <p>載入分類資料中...</p>
    </div>

    <!-- 統計資訊 -->
    <div v-if="!loading" class="statistics">
      <div class="stat-item">
        <span class="stat-label">總分類數:</span>
        <span class="stat-value">{{ currentGroups.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">總產品數:</span>
        <span class="stat-value">{{ currentTotalProducts }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">符合搜尋:</span>
        <span class="stat-value">{{ filteredGroups.length }}</span>
      </div>
    </div>
<!-- 麵包屑導航 -->
    <div v-if="drilldownStack.length > 0" class="breadcrumb">
      <button 
        @click="clearDrilldown"
        class="breadcrumb-btn"
      >
        🏠 全部分類
      </button>
      <span class="breadcrumb-separator">▶</span>
      <span 
        v-for="(item, index) in drilldownStack" 
        :key="index"
        class="breadcrumb-item"
      >
        <button 
          @click="drilldownToLevel(index)"
          class="breadcrumb-btn"
        >
          {{ item.name }}
        </button>
        <span v-if="index < drilldownStack.length - 1" class="breadcrumb-separator">▶</span>
      </span>
    </div>

    <!-- 樹狀結構模式 -->
    <div v-if="viewMode === 'tree' && !loading" class="tree-view">
      <div 
        v-for="group in filteredGroups" 
        :key="group.subcategory"
        class="category-group"
      >
        <div 
          class="category-header"
          @click="toggleCategory(group.subcategory)"
        >
          <span class="category-icon">
            {{ expandedCategories.has(group.subcategory) ? '📂' : '📁' }}
          </span>
          <h3 class="category-title">{{ group.subcategory }}</h3>
          <span class="category-count">({{ group.items.length }})</span>
          <span class="expand-icon">
            {{ expandedCategories.has(group.subcategory) ? '▼' : '▶' }}
          </span>
        </div>

        <div 
          v-if="expandedCategories.has(group.subcategory)"
          class="category-content"
        >
          <!-- 子分類統計 -->
          <div class="subcategory-stats">
            <div class="stat-row">
              <span class="stat-label">子類別:</span>
              <span class="stat-tags">
                <span 
                  v-for="subclass in group.subclasses" 
                  :key="subclass"
                  class="tag clickable-tag"
                  @click="drilldownBySubclass(subclass)"
                >
                  {{ subclass }}
                </span>
              </span>
            </div>
          </div>

          <!-- 產品列表 -->
          <div class="products-list">
            <div 
              v-for="item in group.items" 
              :key="item.id"
              class="product-item"
            >
              <div class="product-info">
                <h4 class="product-title">{{ item.title }}</h4>
                <p class="product-description">{{ item.description }}</p>
                <div class="product-meta">
                  <span class="meta-item">🏷️ {{ item.subclass }}</span>
                  <span class="meta-item">⚙️ {{ item.testMode }}</span>
                  <span class="meta-item">🔧 {{ item.actionType }}</span>
                </div>
              </div>
              <button 
                @click="showProductDetail(item)"
                class="detail-btn"
              >
                詳細
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 產品詳細彈窗 -->
    <div v-if="selectedProduct" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedProduct.title }}</h3>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">主分類:</span>
              <span class="detail-value">{{ selectedProduct.mainCategory }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">子分類:</span>
              <span class="detail-value">{{ selectedProduct.subcategory }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">子類別:</span>
              <span class="detail-value">{{ selectedProduct.subclass }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">測試模式:</span>
              <span class="detail-value">{{ selectedProduct.testMode }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">操作類型:</span>
              <span class="detail-value">{{ selectedProduct.actionType }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">探針/夾具:</span>
              <span class="detail-value">{{ selectedProduct.probe }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">標題:</span>
              <span class="detail-value">{{ selectedProduct.description }}</span>
            </div>
          </div>

          <div class="pdf-section">
            <h4>實驗方法文件</h4>
            
            <!-- 手機版：顯示下載連結 -->
            <div v-if="isMobile" class="mobile-pdf-actions">
              <a 
                :href="selectedProduct.file" 
                target="_blank"
                class="pdf-download-btn"
              >
                📄 開啟PDF文件
              </a>
              <p class="pdf-notice">
                💡 在手機上點擊上方按鈕開啟PDF文件
              </p>
            </div>
            
            <!-- 桌面版：顯示內嵌PDF -->
            <div v-else class="desktop-pdf-viewer">
              <div class="pdf-viewer">
                <iframe
                  :src="selectedProduct.file"
                  frameborder="0"
                  :title="`${selectedProduct.title} 實驗方法文件`"
                ></iframe>
              </div>
              <div class="pdf-actions">
                <a 
                  :href="selectedProduct.file" 
                  target="_blank"
                  class="pdf-open-btn"
                >
                  🔗 在新視窗開啟
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 無資料狀態 -->
    <div v-if="!loading && filteredGroups.length === 0" class="no-data">
      <p>😔 找不到符合條件的分類</p>
      <button v-if="drilldownStack.length > 0" @click="clearDrilldown" class="reset-btn">
        🔄 重置篩選
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 新增 props 定義
const props = defineProps({
  dataSource: {
    type: String,
    default: '../../data/applications_zh.json'
  },
  // 可選：允許直接傳入資料
  initialData: {
    type: Array,
    default: () => []
  }
})

// 你的現有響應式數據
const data = ref([])
const loading = ref(true)
const searchText = ref('')
const viewMode = ref('tree')
const expandedCategories = ref(new Set())
const selectedProduct = ref(null)
const isMobile = ref(false)
const drilldownStack = ref([])

// 檢測是否為手機設備（保持不變）
const checkMobileDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']
  
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword))
  const isMobileWidth = window.innerWidth <= 768
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  return isMobileUA || (isMobileWidth && isTouchDevice)
}

const handleResize = () => {
  isMobile.value = checkMobileDevice()
}

// 修改載入數據的邏輯
onMounted(async () => {
  isMobile.value = checkMobileDevice()
  window.addEventListener('resize', handleResize)
  
  try {
    // 如果有直接傳入的資料，使用它
    if (props.initialData && props.initialData.length > 0) {
      data.value = props.initialData.map(item => ({
        id: item.ID || item.id,
        title: item.Products || item.title,
        mainCategory: item['Main Category'] || item.mainCategory,
        subcategory: item.Subcategory || item.subcategory,
        subclass: item.Subclass || item.subclass,
        testMode: item['Test mode'] || item.testMode,
        actionType: item['Type of action'] || item.actionType,
        probe: item['Probe or Fixture'] || item.probe,
        file: item.file
      }))
    } else {
      // 否則從指定路徑載入
      const res = await fetch(props.dataSource)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      
      const json = await res.json()
      data.value = json.map(item => ({
        id: item.ID,
        title: item.Products,
        description: item.Tittle,
        mainCategory: item['Main Category'],
        subcategory: item.Subcategory,
        subclass: item.Subclass,
        testMode: item['Test mode'],
        actionType: item['Type of action'],
        probe: item['Probe or Fixture'],
        file: item.file
      }))
    }
  } catch (error) {
    console.error('載入資料失敗:', error)
  } finally {
    loading.value = false
  }
})

// 清理事件監聽器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 你的其他 computed 和方法保持不變
const filteredData = computed(() => {
  let filtered = data.value
  
  for (const filter of drilldownStack.value) {
    filtered = filtered.filter(item => {
      switch (filter.type) {
        case 'mainCategory':
          return item.mainCategory === filter.value
        case 'subclass':
          return item.subclass === filter.value
        case 'testMode':
          return item.testMode === filter.value
        case 'actionType':
          return item.actionType === filter.value
        default:
          return true
      }
    })
  }
  
  return filtered
})

// ... 其他現有的 computed 和方法保持不變
const subcategoryGroups = computed(() => {
  const groups = {}
  
  filteredData.value.forEach(item => {
    const subcategory = item.subcategory || '未分類'
    
    if (!groups[subcategory]) {
      groups[subcategory] = {
        subcategory,
        items: [],
        mainCategories: new Set(),
        subclasses: new Set(),
        testModes: new Set(),
        actionTypes: new Set()
      }
    }
    
    groups[subcategory].items.push(item)
    groups[subcategory].mainCategories.add(item.mainCategory)
    groups[subcategory].subclasses.add(item.subclass)
    groups[subcategory].testModes.add(item.testMode)
    groups[subcategory].actionTypes.add(item.actionType)
  })
  
  return Object.values(groups).map(group => ({
    ...group,
    mainCategories: Array.from(group.mainCategories),
    subclasses: Array.from(group.subclasses),
    testModes: Array.from(group.testModes),
    actionTypes: Array.from(group.actionTypes)
  }))
})

const currentGroups = computed(() => subcategoryGroups.value)
const currentTotalProducts = computed(() => filteredData.value.length)

const filteredGroups = computed(() => {
  if (!searchText.value) return currentGroups.value
  
  return currentGroups.value.filter(group => {
    const search = searchText.value.toLowerCase()
    return (
      group.subcategory.toLowerCase().includes(search) ||
      group.items.some(item => 
        item.title.toLowerCase().includes(search) ||
        item.mainCategory.toLowerCase().includes(search) ||
        item.subclass.toLowerCase().includes(search)
      )
    )
  })
})

// 你的其他方法保持不變...
const drilldownByMainCategory = (mainCategory) => {
  drilldownStack.value.push({
    type: 'mainCategory',
    value: mainCategory,
    name: `主分類: ${mainCategory}`
  })
}

const drilldownBySubclass = (subclass) => {
  drilldownStack.value.push({
    type: 'subclass',
    value: subclass,
    name: `子類別: ${subclass}`
  })
}

const drilldownByTestMode = (testMode) => {
  drilldownStack.value.push({
    type: 'testMode',
    value: testMode,
    name: `測試模式: ${testMode}`
  })
}

const drilldownByActionType = (actionType) => {
  drilldownStack.value.push({
    type: 'actionType',
    value: actionType,
    name: `操作類型: ${actionType}`
  })
}

const drilldownToLevel = (level) => {
  drilldownStack.value = drilldownStack.value.slice(0, level + 1)
}

const clearDrilldown = () => {
  drilldownStack.value = []
}

const toggleCategory = (subcategory) => {
  if (expandedCategories.value.has(subcategory)) {
    expandedCategories.value.delete(subcategory)
  } else {
    expandedCategories.value.add(subcategory)
  }
}

const showProductDetail = (product) => {
  selectedProduct.value = product
}

const closeModal = () => {
  selectedProduct.value = null
}
</script>
<style>
.subcategory-classifier {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft JhengHei', 'Segoe UI', Arial, sans-serif;
}

/* 頭部控制區 */
.header-controls {
  background: var(--vp-c-bg-soft);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid var(--vp-c-border);
}

.search-section {
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.view-controls {
  display: flex;
  gap: 10px;
}

.view-btn {
  padding: 8px 16px;
  border: 2px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.view-btn:hover {
  border-color: var(--vp-c-brand);
}

/* 載入狀態 */
.loading {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-2);
}

/* 統計資訊 */
.statistics {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.stat-value {
  font-weight: bold;
  color: var(--vp-c-brand);
}

.category-group {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  margin-bottom: 15px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.category-header:hover {
  background: var(--vp-c-bg-mute);
}

.category-icon {
  font-size: 20px;
}

.category-title {
  flex: 1;
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 18px;
}

.category-count {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.expand-icon {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.category-content {
  padding: 0 20px 20px 20px;
}

.clickable-tag {
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  position: relative;
}

.clickable-tag:hover {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.clickable-tag:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.clickable-tag::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 6px;
  background: transparent;
  transition: all 0.3s ease;
  z-index: -1;
}

.clickable-tag:hover::before {
  background: rgba(100, 108, 255, 0.1);
}

.subcategory-stats {
  margin-bottom: 15px;
  padding: 15px;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.stat-row:last-child {
  margin-bottom: 0;
}

.stat-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.products-list {
  display: grid;
  gap: 10px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-item:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-info {
  flex: 1;
}

.product-title {
  margin: 0 0 5px 0;
  color: var(--vp-c-text-1);
  font-size: 16px;
}

.product-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.detail-btn {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.detail-btn:hover {
  background: var(--vp-c-brand-dark);
}

/* 網格模式 */
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.category-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  padding: 20px;
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 15px;
  border-bottom: 1px solid var(--vp-c-border);
  padding-bottom: 10px;
}

.card-title {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 18px;
}

.card-count {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.card-stats {
  margin-bottom: 15px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat-cell {
  text-align: center;
  padding: 10px;
  background: var(--vp-c-bg);
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
}

.stat-cell .stat-label {
  display: block;
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 5px;
}

.stat-cell .stat-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--vp-c-brand);
}

.card-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.action-btn.primary {
  background: var(--vp-c-brand);
  color: white;
}

.action-btn.primary:hover {
  background: var(--vp-c-brand-dark);
}

.action-btn.secondary {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
}

.action-btn.secondary:hover {
  background: var(--vp-c-bg-mute);
}

/* 彈窗模態 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--vp-c-bg);
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--vp-c-border);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--vp-c-border);
}

.modal-header h3 {
  margin: 0;
  color: var(--vp-c-text-1);
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--vp-c-text-2);
  padding: 5px;
}

.close-btn:hover {
  color: var(--vp-c-text-1);
}

.modal-body {
  padding: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-label {
  font-weight: bold;
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.detail-value {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.pdf-section h4 {
  margin: 0 0 15px 0;
  color: var(--vp-c-text-1);
}

/* 手機版 PDF 處理 */
.mobile-pdf-actions {
  text-align: center;
  padding: 20px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
}

.pdf-download-btn {
  display: inline-block;
  background: var(--vp-c-brand);
  color: rgb(0, 0, 0);
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}



.pdf-notice {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin: 10px 0 0 0;
}

/* 桌面版 PDF 檢視器 */
.desktop-pdf-viewer {
  margin-top: 10px;
}

.pdf-viewer {
  width: 100%;
  height: 400px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin-bottom: 10px;
}

.pdf-viewer iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
}

.pdf-actions {
  text-align: center;
}

.pdf-open-btn {
  display: inline-block;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid var(--vp-c-border);
  transition: all 0.3s ease;
}

.pdf-open-btn:hover {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand);
}

.no-data {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-2);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .subcategory-classifier {
    padding: 10px;
  }
  
  .header-controls {
    padding: 15px;
  }
  
  .view-controls {
    flex-direction: column;
  }
  
  .view-btn {
    width: 100%;
  }
  
  .statistics {
    flex-direction: column;
    gap: 10px;
  }
  
  .stat-grid {
    grid-template-columns: 1fr;
  }
  
  .product-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .product-meta {
    flex-direction: column;
    gap: 5px;
  }
  
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 15px;
  }
  
  .modal-body {
    padding: 15px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .grid-view {
    grid-template-columns: 1fr;
  }
  
  .category-card {
    padding: 15px;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>