


import ChatMessage from "../models/ChatMessage.js";

const SYSTEM_PROMPT = `You are the VedaCare AI Assistant, a friendly, knowledgeable health companion embedded in a
personal health dashboard app. You help users understand their symptoms, medicines, vitals, and general
wellness questions in plain, reassuring language.

Rules you must follow:
- You are NOT a doctor and cannot diagnose conditions or prescribe treatment. Make this clear whenever the
  user asks something that sounds like it needs a real medical evaluation.
- For anything urgent (chest pain, difficulty breathing, severe bleeding, stroke symptoms, suicidal thoughts,
  etc.) tell the user clearly to seek emergency care or call local emergency services immediately.
- Keep answers concise and easy to read — short paragraphs or bullet points, no walls of text.
- You can reference general health/wellness knowledge, but always suggest confirming anything important with
  a licensed clinician.
- Be warm and encouraging, never alarmist.`;

const HISTORY_WINDOW = 20; // messages of context sent to the model

async function callGemini(history) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  if (!apiKey) {
    const err = new Error("GEMINI_API_KEY is not configured on the server");
    err.status = 500;
    throw err;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: { temperature: 0.6, maxOutputTokens: 800 },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    const err = new Error(`Gemini API error (${response.status}): ${errBody}`);
    err.status = 502;
    throw err;
  }

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim();

  if (!reply) {
    // Model returned no usable text — often due to safety blocking.
    const blockReason = data?.promptFeedback?.blockReason;
    return blockReason
      ? "I'm not able to respond to that particular message. Could you rephrase it?"
      : "Sorry, I couldn't generate a response just now. Please try again.";
  }

  return reply;
}

export const getHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: 1 })
      .limit(200);
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Failed to load chat history", error: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const userMessage = await ChatMessage.create({
      user: req.user._id,
      role: "user",
      content: message.trim(),
    });

    const recent = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(HISTORY_WINDOW);
    const history = recent.reverse(); // oldest first for the model

    const replyText = await callGemini(history);

    const assistantMessage = await ChatMessage.create({
      user: req.user._id,
      role: "assistant",
      content: replyText,
    });

    res.json({ userMessage, assistantMessage });
  } catch (err) {
    console.error("❌ Chat request failed:", err.message);
    res.status(err.status || 500).json({ message: "Chat request failed", error: err.message });
  }
};

export const clearHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ user: req.user._id });
    res.json({ message: "Chat history cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear history", error: err.message });
  }
};
