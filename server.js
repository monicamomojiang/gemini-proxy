
const express = require("express");

const app = express();
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyCD1wi80mscT8pO8DYuzdfZSgufsP5hjbw";



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
app.post("/v1/chat/completions", async (req, res) => {
  try {
    let messages = req.body.messages || [];

    let lastMessage = messages[messages.length - 1]?.content || "你好";

    let contents = [
      {
        role: "user",
        parts: [{ text: lastMessage }]
      }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: contents
        })
      }
    );

    const data = await response.json();

    let reply = "没有返回内容";

    if (data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0].content.parts;
      if (parts && parts.length > 0) {
        reply = parts.map(p => p.text).join("");
      }
    }

    res.json({
      id: "chatcmpl-" + Date.now(),
      object: "chat.completion",
      model: "gpt-3.5-turbo",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: reply
          },
          finish_reason: "stop"
        }
      ]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// 👉 启动服务
app.listen(3000, () => {
  console.log("服务已启动：http://localhost:3000");
});