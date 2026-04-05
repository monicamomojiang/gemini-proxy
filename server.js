
const express = require("express");

const app = express();
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyCD1wi80mscT8pO8DYuzdfZSgufsP5hjbw";

app.get("/", (req, res) => {
  res.send("ok");
});



// 👉 models 接口（飞书必须）
app.get("/v1/models", (req, res) => {
  res.json({
    object: "list",
    data: [
      {
        id: "gpt-3.5-turbo",
        object: "model",
        created: 1677610602,
        owned_by: "openai"
      }
    ]
  });
});

// 👉 GET 校验


app.get("/chat/completions", (req, res) => {
  res.json({ status: "ok" });
});

// 👉 GET 校验
app.post("/chat/completions", async (req, res) => {
  req.url = "/v1/chat/completions";
  app._router.handle(req, res);
});

app.get("/chat/completions", (req, res) => {
  res.json({ status: "ok" });
});
app.post("/v1/chat/completions", async (req, res) => {


// 👉 启动服务
app.listen(3000, () => {
  console.log("服务已启动：http://localhost:3000");
});