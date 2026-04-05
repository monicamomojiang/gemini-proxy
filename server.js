
const express = require("express");

const app = express();
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyCD1wi80mscT8pO8DYuzdfZSgufsP5hjbw";

// 👉 根路径（飞书检查用）
app.get("/", (req, res) => {
  res.send("ok");
});

// 👉 models 接口
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

// 👉 统一处理函数
async function handleChat(req, res) {
  const auth = req.headers.authorization || "";
  if (auth && !auth.startsWith("Bearer")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const model = req.body.model || "gpt-3.5-turbo";

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
      model: model,
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
}

// 👉 两个接口
app.post("/v1/chat/completions", handleChat);
app.post("/chat/completions", handleChat);

// 👉 启动服务
app.listen(3000, () => {
  console.log("服务已启动：http://localhost:3000");
});