require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const router = express.Router();


const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// システムプロンプトを組み立てる
function buildPrompt(data) {
  return `
あなたは新卒就活生向けのキャリアアドバイザーです。
以下の情報をもとに、就活生に向けて**おすすめの業界と業種をそれぞれ簡潔に3つ以内**で提案してください。

# 入力情報
目標（Goal）：${data.goal}
興味・関心（Interest）：${data.interest}
学んできたこと（Learn）：${data.learn}
働き方の希望（Work）：${data.work}
苦手・避けたいこと（Weak）：${data.weak}
その他重視していること（Other）：${data.other}
MBTI結果（MBTI）：${data.mbti}

# 出力フォーマット（この形を厳守してください）
＃おすすめの業界
- 業界名1
- 業界名2
- 業界名3

＃おすすめの業種
- 業種名1
- 業種名2
- 業種名3
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