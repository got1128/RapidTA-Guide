<template>
  <div v-if="!isAuthenticated" class="password-overlay">
    <div class="password-container">
      <!-- 語言選擇步驟 -->
      <div v-if="!languageSelected" class="language-box">
        <h2>🌐 {{ defaultText.selectLanguage }}</h2>
        <p>{{ defaultText.chooseLanguage }}</p>
        
        <div class="language-options">
          <button 
            v-for="(lang, code) in languages" 
            :key="code"
            @click="selectLanguage(code)"
            class="language-btn"
          >
            <span class="flag">{{ lang.flag }}</span>
            <span class="name">{{ lang.name }}</span>
            <span class="path">{{ lang.path }}</span>
          </button>
        </div>
        
        <!-- 添加底部空間以匹配密碼框高度 -->
        <div class="spacer"></div>
      </div>

      <!-- 密碼輸入步驟 -->
      <div v-else-if="!isValidating" class="password-box">
        <div class="language-switcher">
          <button @click="goBackToLanguageSelection" class="back-btn">
            ← {{ text.back }}
          </button>
          <div class="current-language">
            <span>{{ languages[selectedLanguage].flag }}</span>
            <span>{{ languages[selectedLanguage].name }}</span>
          </div>
        </div>

        <h2>🔒 {{ text.title }}</h2>
        <p>{{ text.description }}</p>
        
        <div class="input-group">
          <input 
            v-for="(digit, index) in digits" 
            :key="index"
            :value="digits[index]"
            @input="handleInput(index, $event)"
            @keydown="handleKeydown($event, index)"
            :ref="el => inputRefs[index] = el"
            type="text"
            inputmode="numeric"
            pattern="[0-9]"
            maxlength="1"
            class="digit-input"
            :class="{ 'error': hasError }"
            placeholder="0"
          />
        </div>
        
        <div v-if="hasError" class="error-message">
          {{ text.errorMessage }}
        </div>
        
        <button 
          @click="validatePassword" 
          :disabled="!allDigitsFilled"
          class="submit-btn"
          :class="{ 'disabled': !allDigitsFilled }"
        >
          {{ text.confirm }}
        </button>
      </div>

      <!-- 驗證成功提示 -->
      <div v-else class="success-box">
        <div class="success-animation">
          <div class="checkmark">✓</div>
        </div>
        <h2>{{ text.success }}</h2>
        <p>{{ text.redirecting }}</p>
        <div class="target-info">
          <span class="flag">{{ languages[selectedLanguage].flag }}</span>
          <span class="path">{{ languages[selectedLanguage].path }}</span>
        </div>
        <div class="loading-bar">
          <div class="loading-progress"></div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="content-wrapper">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const digits = ref(['', '', '', ''])
const hasError = ref(false)
const isAuthenticated = ref(false)
const languageSelected = ref(false)
const selectedLanguage = ref('en')
const isValidating = ref(false)
const inputRefs = ref([])

// 預設語言文字（用於語言選擇頁面）
const defaultText = {
  selectLanguage: 'Select Language',
  chooseLanguage: 'Please choose your preferred language'
}

// 多語言配置
const languages = {
  'en': {
    flag: '🇺🇸',
    name: 'English',
    path: '/RapidTA-Guide/',  // 你的英文頁面路徑
    texts: {
      title: 'Content Protection',
      description: 'Enter the 4-digit access code',
      confirm: 'Confirm',
      back: 'Back',
      success: 'Access Granted!',
      redirecting: 'Redirecting to English content...',
      errorMessage: 'Invalid code. Please try again.'
    }
  },
  'zh-CN': {
    flag: '🇨🇳',
    name: '简体中文',
    path: '/RapidTA-Guide/cn/',  // 你的簡體中文頁面路徑
    texts: {
      title: '内容保护',
      description: '请输入4位数字访问码',
      confirm: '确认',
      back: '返回',
      success: '验证成功！',
      redirecting: '正在跳转到简体中文内容...',
      errorMessage: '访问码错误，请重试。'
    }
  },
  'zh-TW': {
    flag: '🇹🇼',
    name: '繁體中文',
    path: '/RapidTA-Guide/zh/',  // 你的繁體中文頁面路徑
    texts: {
      title: '內容保護',
      description: '請輸入4位數字存取碼',
      confirm: '確認',
      back: '返回',
      success: '驗證成功！',
      redirecting: '正在跳轉到繁體中文內容...',
      errorMessage: '存取碼錯誤，請重試。'
    }
  }
}

// 當前語言文字
const text = computed(() => {
  return languages[selectedLanguage.value].texts
})

// 檢查是否已經通過驗證和語言選擇
onMounted(() => {
  const authStatus = sessionStorage.getItem('vitepress-auth')
  const savedLanguage = sessionStorage.getItem('vitepress-language')
  
  if (authStatus === 'true') {
    isAuthenticated.value = true
  }
  
  if (savedLanguage && languages[savedLanguage]) {
    selectedLanguage.value = savedLanguage
    languageSelected.value = true
  }
})

const selectLanguage = (languageCode) => {
  selectedLanguage.value = languageCode
  languageSelected.value = true
  sessionStorage.setItem('vitepress-language', languageCode)
}

const goBackToLanguageSelection = () => {
  languageSelected.value = false
  digits.value = ['', '', '', '']
  hasError.value = false
}

const currentSum = computed(() => {
  return digits.value.reduce((sum, digit) => {
    const num = parseInt(digit) || 0
    return sum + num
  }, 0)
})

const allDigitsFilled = computed(() => {
  return digits.value.every(digit => digit !== '' && digit !== null)
})

const handleInput = (index, event) => {
  const value = event.target.value
  
  // 只允許數字，移除非數字字符
  const numericValue = value.replace(/[^0-9]/g, '')
  
  // 只保留最後一個字符
  if (numericValue.length > 1) {
    digits.value[index] = numericValue.slice(-1)
  } else {
    digits.value[index] = numericValue
  }
  
  // 確保輸入框顯示正確的值
  event.target.value = digits.value[index]
  
  // 自動跳到下一個輸入框
  if (numericValue && index < 3) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }
  
  // 清除錯誤狀態
  if (hasError.value) {
    hasError.value = false
  }
}

const handleKeydown = (event, index) => {
  // 退格鍵處理
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    nextTick(() => {
      inputRefs.value[index - 1]?.focus()
    })
  }
  
  // Enter 鍵提交
  if (event.key === 'Enter') {
    validatePassword()
  }
}

const validatePassword = () => {
  if (!allDigitsFilled.value) return
  
  if (currentSum.value === 16) {
    // 顯示驗證成功畫面
    isValidating.value = true
    hasError.value = false
    
    // 儲存驗證狀態
    sessionStorage.setItem('vitepress-auth', 'true')
    
    // 延遲跳轉，讓用戶看到成功動畫
    setTimeout(() => {
      const targetPath = languages[selectedLanguage.value].path
      if (targetPath) {
        // 如果是當前頁面的子路徑，使用相對路徑
        window.location.href = targetPath
      }
    }, 1000) // 1秒後跳轉
    
  } else {
    hasError.value = true
    // 清空輸入並重新聚焦第一個輸入框
    setTimeout(() => {
      digits.value = ['', '', '', '']
      nextTick(() => {
        inputRefs.value[0]?.focus()
      })
    }, 500)
  }
}
</script>

<style scoped>
.password-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
  /* 強制使用淺色主題，避免受系統黑暗模式影響 */
  color-scheme: light !important;
}

.password-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  width: 100%;
}

/* 統一容器樣式 - 確保相同高度和白色背景 */
.language-box,
.password-box,
.success-box {
  /* 強制背景為白色，不受黑暗模式影響 */
  background: #ffffff !important;
  color: #333333 !important;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
  min-height: 500px; /* 設置最小高度確保一致性 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: fadeIn 0.5s ease;
  /* 確保所有子元素也使用淺色主題 */
  color-scheme: light !important;
}

/* 手機響應式優化 */
@media (max-width: 480px) {
  .password-container {
    padding: 15px;
  }
  
  .language-box,
  .password-box,
  .success-box {
    padding: 30px 20px;
    min-height: 450px;
    max-width: 100%;
  }
}

.language-box h2,
.password-box h2 {
  margin-bottom: 10px;
  color: #333333 !important;
  font-size: clamp(20px, 4vw, 24px);
}

.language-box p,
.password-box p {
  margin-bottom: 30px;
  color: #666666 !important;
  font-size: clamp(14px, 3vw, 16px);
}

/* 語言選擇樣式 - 手機優化 */
.language-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 0;
  flex: 1;
  justify-content: center;
  background: #ffffff !important;
  border-radius: 8px;
  margin: 10px 0;
}

@media (max-width: 480px) {
  .language-options {
    gap: 10px;
    margin: 8px 0;
  }
}

.language-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 16px;
  border: 2px solid #e1e8ed !important;
  border-radius: 12px;
  background: #ffffff !important;
  color: #333333 !important;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: clamp(14px, 3vw, 16px);
  min-height: 60px;
}

/* 手機版語言按鈕優化 */
@media (max-width: 480px) {
  .language-btn {
    padding: 12px 14px;
    min-height: 55px;
    gap: 8px;
  }
  
  .language-btn .flag {
    font-size: 20px;
  }
  
  .language-btn .name {
    font-size: 14px;
  }
  
  .language-btn .path {
    font-size: 10px;
    padding: 2px 6px;
  }
}

.language-btn:hover {
  border-color: #667eea !important;
  background: #f8f9ff !important;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .language-btn:hover {
    transform: translateY(-1px);
  }
}

.language-btn .flag {
  font-size: 24px;
}

.language-btn .name {
  font-weight: 500;
  color: #333333 !important;
  flex: 1;
  text-align: left;
}

.language-btn .path {
  font-size: 12px;
  color: #999999 !important;
  background: #f5f5f5 !important;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

/* 底部空間填充器 */
.spacer {
  height: 60px;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .spacer {
    height: 40px;
  }
}

/* 語言切換器 */
.language-switcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  margin: -40px -40px 20px -40px;
  background: #ffffff !important;
  border-bottom: 1px solid #eeeeee !important;
  border-radius: 16px 16px 0 0;
  color-scheme: light !important;
}

/* 手機版語言切換器調整 */
@media (max-width: 480px) {
  .language-switcher {
    margin: -30px -20px 20px -20px;
    padding: 12px 20px;
  }
}

@media (max-width: 360px) {
  .language-switcher {
    margin: -20px -15px 20px -15px;
    padding: 10px 15px;
  }
}

.back-btn {
  background: #ffffff !important;
  border: 1px solid #e1e8ed !important;
  color: #667eea !important;
  cursor: pointer;
  font-size: clamp(12px, 3vw, 14px);
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.back-btn:hover {
  background: #f8f9ff !important;
  border-color: #667eea !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.current-language {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: clamp(12px, 3vw, 14px);
  color: #666666 !important;
}

/* 成功提示樣式 */
.success-box {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%) !important;
  color: #ffffff !important;
  text-align: center;
}

.success-box h2,
.success-box p {
  color: #ffffff !important;
}

.success-animation {
  margin-bottom: 20px;
}

.checkmark {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 20px;
  animation: checkmarkAnimation 0.6s ease-in-out;
  color: #ffffff !important;
}

@media (max-width: 480px) {
  .checkmark {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }
}

@keyframes checkmarkAnimation {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.target-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.target-info .flag {
  font-size: 20px;
}

.target-info .path {
  font-family: monospace;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  color: #ffffff !important;
  font-size: clamp(10px, 2.5vw, 12px);
}

.loading-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 20px;
}

.loading-progress {
  height: 100%;
  background: #ffffff !important;
  border-radius: 2px;
  animation: loading 2s linear forwards;
}

@keyframes loading {
  from { width: 0%; }
  to { width: 100%; }
}

/* 密碼輸入樣式 - 響應式優化 */
.input-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  flex: 1;
  align-items: center;
}

@media (max-width: 480px) {
  .input-group {
    gap: 10px;
  }
}

.digit-input {
  width: 60px;
  height: 60px;
  border: 2px solid #dddddd !important;
  border-radius: 8px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  transition: all 0.3s ease;
  background: #ffffff !important;
  color: #333333 !important;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: textfield;
}

@media (max-width: 480px) {
  .digit-input {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}

.digit-input::-webkit-outer-spin-button,
.digit-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.digit-input:focus {
  outline: none;
  border-color: #667eea !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: #ffffff !important;
}

.digit-input.error {
  border-color: #ff4757 !important;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-message {
  color: #ff4757 !important;
  font-size: clamp(12px, 3vw, 14px);
  margin-bottom: 15px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #ffffff !important;
  border: none !important;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: clamp(14px, 3vw, 16px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.submit-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

@media (max-width: 480px) {
  .submit-btn:hover:not(.disabled) {
    transform: translateY(-1px);
  }
}

.submit-btn.disabled {
  background: #cccccc !important;
  cursor: not-allowed;
}

.content-wrapper {
  animation: fadeIn 0.5s ease;
}

/* 確保在極小螢幕上的可用性 */
@media (max-width: 360px) {
  .language-box,
  .password-box,
  .success-box {
    padding: 20px 15px;
    min-height: 400px;
  }
  
  .language-btn {
    padding: 10px 12px;
    min-height: 50px;
  }
  
  .input-group {
    gap: 8px;
  }
  
  .digit-input {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
}
</style>