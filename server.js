require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Translation Schema
const TranslationSchema = new mongoose.Schema({
  text: { type: String, required: true },
  translatedText: { type: String, required: true },
  sourceLang: { type: String, required: true },
  targetLang: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Translation = mongoose.model("Translation", TranslationSchema);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🚀 Translation API is running! Use /translate to translate text.");
});

// ✅ Translation Route using MyMemory API (No 'auto' source)
app.post("/translate", async (req, res) => {
  const { text, sourceLang, targetLang } = req.body;

  if (!text || !sourceLang || !targetLang) {
    return res.status(400).json({ error: "Text, source language, and target language are required." });
  }

  try {
    const response = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );

    if (!response.data.responseData.translatedText) {
      throw new Error("Translation API returned an invalid response.");
    }

    const translatedText = response.data.responseData.translatedText;

    // ✅ Save translation to MongoDB
    const newTranslation = new Translation({ text, translatedText, sourceLang, targetLang });
    await newTranslation.save();

    res.json({ text, translatedText, sourceLang, targetLang });
  } catch (error) {
    console.error("❌ Translation Error:", error.message);
    res.status(500).json({ error: "Translation failed. Please try again later." });
  }
});

// ✅ Retrieve Translation History
app.get("/history", async (req, res) => {
  try {
    const history = await Translation.find().sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    console.error("❌ Error fetching history:", error.message);
    res.status(500).json({ error: "Error fetching translation history." });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
