require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const router = express.Router();


const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// プロンプトを組み立てる
function buildPrompt(data) {
  const goalText = Array.isArray(data.goal) ? data.goal.join('、') : data.goal;
  const interestText = Array.isArray(data.interest) ? data.interest.join('、') : data.interest;
  const learnText = Array.isArray(data.learn) ? data.learn.join('、') : data.learn;
  const workText = Array.isArray(data.work) ? data.work.join('、') : data.work;
  const weakText = Array.isArray(data.weak) ? data.weak.join('、') : data.weak;

  return `
あなたは就職活動支援のプロフェッショナルです。
以下の情報をもとに、この学生におすすめの業界・業種を3つ提案し、それぞれの理由を簡潔に説明してください。

# 学生の情報
・将来の目標：${goalText}
・興味・関心：${interestText}
・学習内容：${learnText}
・希望する働き方：${workText}
・避けたいこと：${weakText}
・その他：${data.other}
・MBTI：${data.mbti}

# 出力フォーマット（この形式を厳守してください）
【おすすめ業界・業種】

## 1. [業界名・業種名]
**理由**: [なぜこの業界がおすすめなのか、学生の特徴と関連付けて1-2文で説明]

## 2. [業界名・業種名]  
**理由**: [なぜこの業界がおすすめなのか、学生の特徴と関連付けて1-2文で説明]

## 3. [業界名・業種名]
**理由**: [なぜこの業界がおすすめなのか、学生の特徴と関連付けて1-2文で説明]

【詳細説明】
[全体的なアドバイスや補足説明を3-4文で記載]

※各理由は具体的で、学生の入力内容と明確に関連付けてください
※業界名は「IT業界」「金融業界」「製造業」のように具体的に記載してください
`;
}

router.post('/', async (req, res) => {
  const userInput = req.body; // フロントから送られてきたデータを取得
 

  const prompt = buildPrompt(userInput); // buildPrompt() を呼んで、プロンプト文を作る

  try {
    const response = await axios.post(GEMINI_URL, { //axios.post() を使って Gemini API に送る
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text; //返ってきた文章（おすすめ）を抽出して result に格納
    res.json({ suggestion: result });
  } catch (error) {
    console.error("❌ APIエラー:", error.response?.data || error.message);
    res.status(500).json({ error: "Gemini API の呼び出しに失敗しました" });
  }
});
module.exports = router;