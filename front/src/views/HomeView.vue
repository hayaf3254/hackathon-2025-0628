<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSuggestionStore } from '../stores/suggestion'

const router = useRouter()
const suggestionStore = useSuggestionStore()

const formData = ref({
  goal: [],
  interest: [],
  learn: [],
  work: [],
  weak: [],
  other: '',
  mbti: ''
})

const customInputs = ref({
  goal: '',
  interest: '',
  learn: '',
  work: '',
  weak: ''
})

const showCustomInput = ref({
  goal: false,
  interest: false,
  learn: false,
  work: false,
  weak: false
})

const options = {
  goal: [
    '社会貢献したい',
    '高収入を得たい',
    'ワークライフバランス重視',
    'スキルアップしたい',
    'リーダーシップを発揮したい',
    '安定した職業に就きたい'
  ],
  interest: [
    'テクノロジー・IT',
    'デザイン・クリエイティブ',
    'ビジネス・経営',
    '教育・人材育成',
    '医療・健康',
    'エンターテイメント'
  ],
  learn: [
    '経済学・経営学',
    '工学・理工学',
    '文学・人文学',
    '法学・政治学',
    '医学・薬学',
    '情報・コンピューター'
  ],
  work: [
    'リモートワーク可能',
    'フレックスタイム制',
    'チームワーク重視',
    '個人作業中心',
    '出張・転勤あり',
    '定時退社'
  ],
  weak: [
    '長時間労働',
    '営業・接客',
    '単純作業の繰り返し',
    '高いプレッシャー',
    '夜勤・シフト勤務',
    '転勤・出張'
  ]
}

function handleOptionToggle(category, option) {
  if (formData.value[category].includes(option)) {
    formData.value[category] = formData.value[category].filter(item => item !== option)
  } else {
    formData.value[category].push(option)
  }
}

function addCustomOption(category) {
  const customValue = customInputs.value[category].trim()
  if (customValue && !formData.value[category].includes(customValue)) {
    formData.value[category].push(customValue)
    customInputs.value[category] = ''
    showCustomInput.value[category] = false
  }
}

function removeCustomOption(category, option) {
  formData.value[category] = formData.value[category].filter(item => item !== option)
}

async function handleSubmit() {
  try {
    const response = await fetch('http://localhost:3000/suggest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    })

    if (!response.ok) {
      throw new Error(`サーバーエラー: ${response.status}`)
    }

    const data = await response.json()
    // 取得した結果をストアに保存し、結果表示ページへ遷移
    suggestionStore.setSuggestion(data.suggestion)
    router.push({ name: 'result' })
  } catch (error) {
    console.error('送信に失敗しました:', error)
    alert('Gemini への送信に失敗しました。時間を置いて再度お試しください。')
  }
}
</script>

<template>
  <div class="bg-main">
    <div class="main-card">
      <h1 class="main-title">目標設定</h1>
      <p class="main-desc">
        あなたのキャリア目標や価値観について教えてください。<br />複数選択可能です。
      </p>
    </div>

    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">将来の目標</h2>
        <p class="section-description">あなたがキャリアで実現したいことは何ですか？</p>
      </div>
      <div class="options-list">
        <template v-for="option in options.goal" :key="option">
          <button
            class="option-btn"
            :class="{ selected: formData.goal.includes(option) }"
            @click="handleOptionToggle('goal', option)"
          >
            {{ option }}
          </button>
        </template>
        <button
          class="option-btn add-btn"
          @click="showCustomInput.goal = !showCustomInput.goal"
        >
          その他
        </button>
      </div>
      <div v-if="showCustomInput.goal" class="custom-input-wrap">
        <input
          v-model="customInputs.goal"
          class="custom-input"
          type="text"
          placeholder="カスタム項目を入力..."
          @keypress.enter="addCustomOption('goal')"
        />
        <button class="add-custom-btn" @click="addCustomOption('goal')">追加</button>
      </div>
      <div v-if="formData.goal.filter(item => !options.goal.includes(item)).length > 0" class="custom-tags">
        <span
          v-for="item in formData.goal.filter(item => !options.goal.includes(item))"
          :key="item"
          class="custom-tag"
        >
          {{ item }}
          <button class="remove-tag" @click="removeCustomOption('goal', item)">×</button>
        </span>
      </div>
    </div>

    <!-- 興味・関心のあること -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">興味・関心のあること</h2>
        <p class="section-description">どのような分野に興味をお持ちですか？</p>
      </div>
      <div class="options-list">
        <template v-for="option in options.interest" :key="option">
          <button
            class="option-btn"
            :class="{ selected: formData.interest.includes(option) }"
            @click="handleOptionToggle('interest', option)"
          >
            {{ option }}
          </button>
        </template>
        <button
          class="option-btn add-btn"
          @click="showCustomInput.interest = !showCustomInput.interest"
        >
          その他
        </button>
      </div>
      <div v-if="showCustomInput.interest" class="custom-input-wrap">
        <input
          v-model="customInputs.interest"
          class="custom-input"
          type="text"
          placeholder="カスタム項目を入力..."
          @keypress.enter="addCustomOption('interest')"
        />
        <button class="add-custom-btn" @click="addCustomOption('interest')">追加</button>
      </div>
      <div v-if="formData.interest.filter(item => !options.interest.includes(item)).length > 0" class="custom-tags">
        <span
          v-for="item in formData.interest.filter(item => !options.interest.includes(item))"
          :key="item"
          class="custom-tag"
        >
          {{ item }}
          <button class="remove-tag" @click="removeCustomOption('interest', item)">×</button>
        </span>
      </div>
    </div>

    <!-- 学んできたこと -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">学んできたこと</h2>
        <p class="section-description">専攻・ゼミ・資格など、これまで学習してきた分野を教えてください</p>
      </div>
      <div class="options-list">
        <template v-for="option in options.learn" :key="option">
          <button
            class="option-btn"
            :class="{ selected: formData.learn.includes(option) }"
            @click="handleOptionToggle('learn', option)"
          >
            {{ option }}
          </button>
        </template>
        <button class="option-btn add-btn" @click="showCustomInput.learn = !showCustomInput.learn">その他</button>
      </div>
      <div v-if="showCustomInput.learn" class="custom-input-wrap">
        <input
          v-model="customInputs.learn"
          class="custom-input"
          type="text"
          placeholder="カスタム項目を入力..."
          @keypress.enter="addCustomOption('learn')"
        />
        <button class="add-custom-btn" @click="addCustomOption('learn')">追加</button>
      </div>
      <div v-if="formData.learn.filter(item => !options.learn.includes(item)).length > 0" class="custom-tags">
        <span
          v-for="item in formData.learn.filter(item => !options.learn.includes(item))"
          :key="item"
          class="custom-tag"
        >
          {{ item }}
          <button class="remove-tag" @click="removeCustomOption('learn', item)">×</button>
        </span>
      </div>
    </div>

    <!-- 働き方の希望 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">働き方の希望</h2>
        <p class="section-description">どのような働き方を希望しますか？</p>
      </div>
      <div class="options-list">
        <template v-for="option in options.work" :key="option">
          <button
            class="option-btn"
            :class="{ selected: formData.work.includes(option) }"
            @click="handleOptionToggle('work', option)"
          >
            {{ option }}
          </button>
        </template>
        <button class="option-btn add-btn" @click="showCustomInput.work = !showCustomInput.work">その他</button>
      </div>
      <div v-if="showCustomInput.work" class="custom-input-wrap">
        <input
          v-model="customInputs.work"
          class="custom-input"
          type="text"
          placeholder="カスタム項目を入力..."
          @keypress.enter="addCustomOption('work')"
        />
        <button class="add-custom-btn" @click="addCustomOption('work')">追加</button>
      </div>
      <div v-if="formData.work.filter(item => !options.work.includes(item)).length > 0" class="custom-tags">
        <span
          v-for="item in formData.work.filter(item => !options.work.includes(item))"
          :key="item"
          class="custom-tag"
        >
          {{ item }}
          <button class="remove-tag" @click="removeCustomOption('work', item)">×</button>
        </span>
      </div>
    </div>

    <!-- 苦手なこと・避けたい業種 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">苦手なこと・避けたい業種</h2>
        <p class="section-description">避けたい働き方や苦手な業務はありますか？</p>
      </div>
      <div class="options-list">
        <template v-for="option in options.weak" :key="option">
          <button
            class="option-btn"
            :class="{ selected: formData.weak.includes(option) }"
            @click="handleOptionToggle('weak', option)"
          >
            {{ option }}
          </button>
        </template>
        <button class="option-btn add-btn" @click="showCustomInput.weak = !showCustomInput.weak">その他</button>
      </div>
      <div v-if="showCustomInput.weak" class="custom-input-wrap">
        <input
          v-model="customInputs.weak"
          class="custom-input"
          type="text"
          placeholder="カスタム項目を入力..."
          @keypress.enter="addCustomOption('weak')"
        />
        <button class="add-custom-btn" @click="addCustomOption('weak')">追加</button>
      </div>
      <div v-if="formData.weak.filter(item => !options.weak.includes(item)).length > 0" class="custom-tags">
        <span
          v-for="item in formData.weak.filter(item => !options.weak.includes(item))"
          :key="item"
          class="custom-tag"
        >
          {{ item }}
          <button class="remove-tag" @click="removeCustomOption('weak', item)">×</button>
        </span>
      </div>
    </div>

    <!-- その他重視していること -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">その他重視していること</h2>
        <p class="section-description">上記以外で重視している価値観や条件があれば教えてください</p>
      </div>
      <textarea
        v-model="formData.other"
        class="textarea-input"
        rows="4"
        placeholder="例：企業の社会的責任、職場の多様性、成長性など..."
      ></textarea>
    </div>

    <!-- MBTIの結果 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">MBTIの結果</h2>
        <p class="section-description">MBTIテストの結果があれば入力してください（任意）</p>
      </div>
      <input
        v-model="formData.mbti"
        class="text-input-single"
        type="text"
        maxlength="4"
        placeholder="例：ENFP、INTJ など4文字で入力"
      />
    </div>

    <div class="form-actions">
      <button class="submit-btn" @click="handleSubmit">次のステップへ進む</button>
    </div>
  </div>
</template>

<style scoped>
.bg-main {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  padding: 48px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.6s ease;
  position: relative;
  overflow-x: hidden;
}
.bg-main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="0.5" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
  z-index: 0;
}
.main-card {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1), 0 8px 25px rgba(0,0,0,0.08);
  padding: 56px 40px 48px 40px;
  max-width: 600px;
  width: 90%;
  margin-bottom: 32px;
  text-align: center;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255,255,255,0.3);
}
.main-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  letter-spacing: -0.02em;
}
.main-desc {
  font-size: 1.15rem;
  color: #6b7280;
  line-height: 1.8;
  font-weight: 400;
}
.section-card {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(15px);
  border-radius: 28px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.08), 0 6px 20px rgba(0,0,0,0.05);
  padding: 40px 32px;
  max-width: 800px;
  width: 90%;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255,255,255,0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.12), 0 8px 25px rgba(0,0,0,0.08);
}
.section-header {
  margin-bottom: 24px;
}
.section-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}
.section-description {
  font-size: 1.05rem;
  color: #6b7280;
  font-weight: 400;
}
.options-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}
.option-btn {
  background: rgba(255,255,255,0.8);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  padding: 20px 16px;
  font-size: 1.05rem;
  color: #374151;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  backdrop-filter: blur(10px);
}
.option-btn:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  border-color: rgba(102,126,234,0.3);
  background: rgba(255,255,255,0.95);
}
.option-btn.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #ffffff;
  font-weight: 600;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102,126,234,0.3);
}
.option-btn.selected::after {
  content: '✔';
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: #ffffff;
}
.option-btn.add-btn {
  border-style: dashed;
  color: #6b7a99;
  background: #f4f7fb;
}
.option-btn.add-btn:hover {
  border-color: #1976d2;
  color: #1976d2;
}
.custom-input-wrap {
  display: flex;
  gap: 10px;
  margin: 16px 0 0 0;
}
.custom-input {
  flex: 1;
  padding: 12px 16px;
  border: 1.5px solid #b6c6e3;
  border-radius: 10px;
  font-size: 1rem;
}
.add-custom-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.add-custom-btn:hover {
  background: #1253a2;
}
.custom-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.custom-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 500;
}
.remove-tag {
  background: none;
  border: none;
  color: #0369a1;
  cursor: pointer;
  padding: 0 2px;
  font-size: 1.1em;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.remove-tag:hover {
  opacity: 1;
}
.textarea-input {
  width: 100%;
  padding: 16px;
  border: 1.5px solid #b6c6e3;
  border-radius: 12px;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  background: #fafcff;
}
.text-input-single {
  width: 100%;
  padding: 16px;
  border: 1.5px solid #b6c6e3;
  border-radius: 12px;
  font-size: 1rem;
  background: #fafcff;
}
.form-actions {
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;
}
.submit-btn {
  padding: 18px 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  color: #fff;
  border: none;
  border-radius: 60px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(102,126,234,0.4);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  max-width: 90%;
  width: auto;
}
.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}
.submit-btn:hover::before {
  left: 100%;
}
.submit-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 40px rgba(102,126,234,0.5);
}
@media (max-width: 600px) {
  .main-card, .section-card {
    padding: 20px 8px;
    max-width: 98vw;
  }
  .main-title {
    font-size: 2.2rem;
  }
  .section-title {
    font-size: 1.1rem;
  }
  .option-btn {
    font-size: 1rem;
    padding: 14px 0;
  }
  .textarea-input, .text-input-single {
    font-size: 0.95rem;
    padding: 12px;
  }
  .submit-btn {
    width: 85%;
    padding: 16px 24px;
    font-size: 1.1rem;
  }
  .options-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
