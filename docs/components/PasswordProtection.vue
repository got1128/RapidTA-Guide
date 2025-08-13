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

}

// 多語言配置
const languages = {
  'en': {
    flag: '🇺🇸',
    name: 'English',
    path: '/RapidTA-Guide/',  // 你的英文頁面路徑
    texts: {
      title: 'Content Protection',
      confirm: 'Confirm',
      back: 'Back',
      success: 'Access Granted!',
      redirecting: 'Redirecting to English content...'
    }
  },
  'zh-CN': {
    flag: '🇨🇳',
    name: '简体中文',
    path: '/RapidTA-Guide/cn/',  // 你的簡體中文頁面路徑
    texts: {
      title: '内容保护',
      confirm: '确认',
      back: '返回',
      success: '验证成功！',
      redirecting: '正在跳转到简体中文内容...'
    }
  },
  'zh-TW': {
    flag: '🇹🇼',
    name: '繁體中文',
    path: '/RapidTA-Guide/zh/',  // 你的繁體中文頁面路徑
    texts: {
      title: '內容保護',
      confirm: '確認',
      back: '返回',
      success: '驗證成功！',
      redirecting: '正在跳轉到繁體中文內容...'
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
    }, 1000) // 2秒後跳轉
    
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
}

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
  animation: fadeIn 0.5s ease;
  /* 確保所有子元素也使用淺色主題 */
  color-scheme: light !important;
}

.language-box h2,
.password-box h2 {
  margin-bottom: 10px;
  color: #333333 !important;
  font-size: 24px;
}

.language-box p,
.password-box p {
  margin-bottom: 30px;
  color: #666666 !important;
  font-size: 16px;
}

/* 語言選擇樣式 - 強制白色主題 */
.language-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0;
}

.language-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 15px 20px;
  border: 2px solid #e1e8ed !important;
  border-radius: 12px;
  background: #ffffff !important;
  color: #333333 !important;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  margin: 2px 0;
}

.language-btn:hover {
  border-color: #667eea !important;
  background: #f8f9ff !important;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px)
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
}

/* 語言切換器 */
.language-switcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eeeeee !important;
}

.back-btn {
  background: none !important;
  border: none !important;
  color: #667eea !important;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #f0f4ff !important;
}

.current-language {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
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

/* 密碼輸入樣式 */
.input-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
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
  font-size: 14px;
  margin-bottom: 15px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.sum-display {
  font-size: 18px;
  color: #333333 !important;
  margin-bottom: 25px;
  font-weight: 500;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #ffffff !important;
  border: none !important;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.submit-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn.disabled {
  background: #cccccc !important;
  cursor: not-allowed;
}

.content-wrapper {
  animation: fadeIn 0.5s ease;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .language-box,
  .password-box,
  .success-box {
    padding: 30px 20px;
    margin: 20px;
  }
  
  .digit-input {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .input-group {
    gap: 10px;
  }
  
  .language-btn {
    padding: 12px 15px;
  }
}

@media (max-width: 480px) {
  .language-box,
  .password-box,
  .success-box {
    padding: 25px 15px;
    margin: 15px;
  }
  
  .digit-input {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  .input-group {
    gap: 8px;
  }
  
  .language-btn {
    padding: 10px 12px;
    font-size: 14px;
    flex-direction: column;
    text-align: center;
  }
  
  .language-switcher {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}

/* 強制覆蓋黑暗模式的媒體查詢 */
@media (prefers-color-scheme: dark) {
  .password-overlay {
    color-scheme: light !important;
  }
  
  .language-box,
  .password-box {
    background: #ffffff !important;
    color: #333333 !important;
  }
  
  .language-box h2,
  .password-box h2,
  .language-box p,
  .password-box p {
    color: #333333 !important;
  }
  
  .language-btn {
    background: #ffffff !important;
    color: #333333 !important;
    border-color: #e1e8ed !important;
  }
  
  .language-btn:hover {
    background: #f8f9ff !important;
    border-color: #667eea !important;
  }
  
  .language-btn .name {
    color: #333333 !important;
  }
  
  .language-btn .path {
    color: #999999 !important;
    background: #f5f5f5 !important;
  }
  
  .digit-input {
    background: #ffffff !important;
    color: #333333 !important;
    border-color: #dddddd !important;
  }
  
  .digit-input:focus {
    background: #ffffff !important;
    border-color: #667eea !important;
  }
}
</style>