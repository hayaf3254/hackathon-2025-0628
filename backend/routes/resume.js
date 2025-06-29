require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

function buildPrompt(data) {
    return `
以下の情報をもとに、27卒の履歴書を出力してください。

#入力情報
大学名(universityName):${data.universityName}
学部 (facultyName):${data.facultyName}
学科 (departmentName):${data.departmentName}

#出力フォーマット(この形を厳守してください。例文を書く必要はありません。)

氏名:
生年月日:
住所:
電話番号:
メールアドレス:

学歴
卒業年: 2027年3月 卒業見込み
大学名: ${data.universityName}
学部: ${data.facultyName}
学科: ${data.departmentName}
取得見込み学位: (例: 学士)

職務経歴
(新卒のため、特筆すべき職務経歴がない場合は「なし」と記載してください。または、アルバイト経験やインターンシップ経験があれば具体的に記入してください。)

資格・免許
(取得済みの資格や免許があれば記入してください。例: 普通自動車第一種運転免許)

自己PR
(あなたの強みや、学業で得た経験、アルバイトやサークル活動で培ったスキルなどを具体的に記入してください。課題解決能力、コミュニケーション能力、リーダーシップなど、具体的なエピソードを交えて説明すると効果的です。)

志望動機
（応募企業への志望動機を具体的に記入してください。企業研究を通じて、なぜその企業で働きたいのか、どのように貢献できるのかを明確に伝えましょう。）
`;
}

router.post('/', async (req, res) => {
    const userInput = req.body;
    const prompt = buildPrompt(userInput);

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