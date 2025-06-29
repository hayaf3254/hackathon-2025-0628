const express = require("express");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/user");
const suggestRouter = require("./routes/suggest");
const resumeRouter = require("./routes/resume");
app.use(express.json());
app.use(cors());

const PORT = 3000;

app.get("/", (req, res) => {
    // console.log("hello express");
    // res.send("<h1>こんにちは</h1>");
    // res.sendStatus(500);
    // res.status(500).send("エラーです。");
    res.status(500).json({ msg: "エラーです。" });
});

//ルーティング
app.use("/user", userRouter);
app.use("/suggest", suggestRouter);
app.use("/resume", resumeRouter);

app.listen(PORT, () => console.log("サーバーが起動しました"));