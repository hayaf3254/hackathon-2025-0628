require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// 自己PR用のプロンプトを組み立てる
function buildSelfPRPrompt(data) {
  const strengthsText = Array.isArray(data.userStrengths) ? data.userStrengths.join('、') : data.userStrengths;
  
  // 希望業界・職種の処理
  let desiredRoleText = data.desiredRole;
  if (data.desiredRole === 'その他' && data.customDesiredRole) {
    desiredRoleText = data.customDesiredRole;
  } else if (!data.desiredRole) {
    desiredRoleText = '特になし';
  }
  
  return `
あなたは就職活動支援のプロフェッショナルです。
以下の情報をもとに、就職活動向けの「自己PR文」を日本語で作成してください。

# 入力情報
・強み：${strengthsText}
・経験：${data.experienceContext}
・頑張ったこと：${data.effortDetails}
・希望業界・職種：${desiredRoleText}

# 出力要件
・文字数：200〜300字
・敬語で記述
・前向きで積極的な印象
・具体的なエピソードを含める
・企業が求める人材像に合うような表現

# 出力フォーマット
自己PR文のみを出力してください（余計な説明は不要）
`;
}

router.post('/', async (req, res) => {
  const userInput = req.body;

  const prompt = buildSelfPRPrompt(userInput);

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ generatedSelfPR: result });
  } catch (error) {
    console.error("❌ APIエラー:", error.response?.data || error.message);
    res.status(500).json({ error: "Gemini API の呼び出しに失敗しました" });
  }
});

module.exports = router; 