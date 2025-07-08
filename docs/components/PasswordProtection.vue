<template>
  <div v-if="!isAuthenticated" class="password-overlay">
    <div class="password-container">
      <div class="password-box">
        <h2>🔒 內容保護</h2>
        <p>請輸入4個數字，總和等於*</p>
        
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
          總和必須等於*，請重新輸入
        </div>
        
        <div class="sum-display">
          當前總和: {{ currentSum }}
        </div>
        
        <button 
          @click="validatePassword" 
          :disabled="!allDigitsFilled"
          class="submit-btn"
          :class="{ 'disabled': !allDigitsFilled }"
        >
          確認
        </button>
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
const inputRefs = ref([])

// 檢查是否已經通過驗證（從 sessionStorage 讀取）
onMounted(() => {
  const authStatus = sessionStorage.getItem('vitepress-auth')
  if (authStatus === 'true') {
    isAuthenticated.value = true
  }
})

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
    isAuthenticated.value = true
    sessionStorage.setItem('vitepress-auth', 'true')
    hasError.value = false
  } else {
    hasError.value = true
    // 清空輸入並重新聚焦第一個輸入框
    setTimeout(() => {
      digits.value = ['', '', '', '']
      nextTick(() => {
        inputRefs.value[0]?.focus()
      })
    }, 1000)
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
}

.password-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.password-box {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.password-box h2 {
  margin-bottom: 10px;
  color: #333;
  font-size: 24px;
}

.password-box p {
  margin-bottom: 30px;
  color: #666;
  font-size: 16px;
}

.input-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.digit-input {
  width: 60px;
  height: 60px;
  border: 2px solid #ddd;
  border-radius: 8px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  transition: all 0.3s ease;
  background: white;
  color: #333;
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
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.digit-input.error {
  border-color: #ff4757;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-message {
  color: #ff4757;
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
  color: #333;
  margin-bottom: 25px;
  font-weight: 500;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.submit-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
}

.content-wrapper {
  animation: fadeIn 0.5s ease;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .password-box {
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
}

@media (max-width: 480px) {
  .password-box {
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
}

/* 確保在所有設備上都能正常顯示 */
@media (min-width: 769px) {
  .password-overlay {
    display: flex !important;
  }
  
  .password-box {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .digit-input {
    display: inline-block !important;
    visibility: visible !important;
  }
}
</style>