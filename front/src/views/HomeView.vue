<script setup>
import { ref } from 'vue'

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

function handleSubmit() {
  alert('データが保存されました！次のステップに進みます。')
  console.log('Form Data:', formData.value)
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
  background: #f4f7fb;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main-card {
  background: #e9f0fa;
  border-radius: 24px;
  box-shadow: 0 6px 18px rgba(80,120,200,0.08);
  padding: 40px 32px 32px 32px;
  max-width: 600px;
  width: 90%;
  margin-bottom: 32px;
  text-align: center;
}
.main-title {
  font-size: 2.4rem;
  font-weight: bold;
  margin-bottom: 16px;
  color: #222b45;
}
.main-desc {
  font-size: 1.1rem;
  color: #4b587c;
  line-height: 1.7;
}
.section-card {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 6px 18px rgba(80,120,200,0.08);
  padding: 32px 24px;
  max-width: 800px;
  width: 90%;
  margin-bottom: 40px;
}
.section-header {
  margin-bottom: 24px;
}
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #222b45;
  margin-bottom: 8px;
}
.section-description {
  font-size: 1rem;
  color: #6b7a99;
}
.options-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}
.option-btn {
  background: #f7faff;
  border: 2px solid #e3eaf7;
  border-radius: 14px;
  padding: 18px 0;
  font-size: 1.05rem;
  color: #222b45;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(80,120,200,0.05);
}
.option-btn.selected {
  background: #e0edff;
  border-color: #5f9efa;
  color: #1754b8;
  font-weight: 600;
}
.option-btn.selected::after {
  content: '✔';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: #1754b8;
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
  margin-bottom: 60px;
}
.submit-btn {
  padding: 16px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(102,126,234,0.3);
}
.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102,126,234,0.4);
}
@media (max-width: 600px) {
  .main-card, .section-card {
    padding: 20px 8px;
    max-width: 98vw;
  }
  .main-title {
    font-size: 1.5rem;
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
    width: 90%;
  }
  .options-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
