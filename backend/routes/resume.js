require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// 履歴書用のプロンプトを組み立てる
function buildResumePrompt(data) {
  // 年号変換関数
  function convertToJapaneseEra(year, month) {
    if (year >= 2019) {
      return `令和${year - 2018}年${month}月`;
    } else if (year >= 1989) {
      return `平成${year - 1988}年${month}月`;
    } else {
      return `昭和${year - 1925}年${month}月`;
    }
  }

  const hsGraduation = convertToJapaneseEra(parseInt(data.highSchoolGraduationYear), parseInt(data.highSchoolGraduationMonth));
  const uniEntrance = convertToJapaneseEra(parseInt(data.universityEntranceYear), parseInt(data.universityEntranceMonth));
  const uniGraduation = convertToJapaneseEra(parseInt(data.universityGraduationYear), parseInt(data.universityGraduationMonth));

  return `
あなたは就職活動支援のプロフェッショナルです。
以下の情報をもとに、履歴書の「学歴・職歴」欄を作成してください。

# 入力情報
高校名：${data.highSchoolName}
大学名：${data.universityName}
学部：${data.facultyName}
学科：${data.departmentName}
高校卒業：${hsGraduation}
大学入学：${uniEntrance}
大学卒業予定：${uniGraduation}

# 出力フォーマット（この形を厳守してください）
学歴・職歴

${hsGraduation}　${data.highSchoolName}高校　卒業
${uniEntrance}　${data.universityName}${data.facultyName}${data.departmentName}　入学
${uniGraduation}　${data.universityName}${data.facultyName}${data.departmentName}　卒業見込み

以上

※入力された正確な学校名を使用してください
`;
}

router.post('/', async (req, res) => {
  const userInput = req.body;

  const prompt = buildResumePrompt(userInput);

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
    res.json({ generatedWorkHistory: result });
  } catch (error) {
    console.error("❌ APIエラー:", error.response?.data || error.message);
    res.status(500).json({ error: "Gemini API の呼び出しに失敗しました" });
  }
});

module.exports = router; 