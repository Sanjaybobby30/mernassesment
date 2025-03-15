import React, { useState } from "react";
import axios from "axios";
import "./Translation.css";

const Translation = () => {
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("en"); // ✅ Default source: English
  const [targetLang, setTargetLang] = useState("es"); // ✅ Default target: Spanish
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const translateText = async () => {
    if (!text.trim()) {
      setError("Please enter text to translate.");
      return;
    }

    setLoading(true);
    setTranslatedText(""); // Clear old translation
    setError(""); // Clear errors

    try {
      const response = await axios.post("http://localhost:5000/translate", {
        text,
        sourceLang, // ✅ Ensure sourceLang is included
        targetLang,
      });

      console.log("API Response:", response.data); // Debugging

      if (response.data.translatedText) {
        setTranslatedText(response.data.translatedText);
      } else {
        setError("Translation failed. Try again.");
      }
    } catch (error) {
      console.error("Error translating:", error);
      setError("Error fetching translation. Please check the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>🌍 Text Translation Tool</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text..."
        rows="4"
      />

      {/* ✅ Source Language Selection */}
      <label>Source Language:</label>
      <select onChange={(e) => setSourceLang(e.target.value)} value={sourceLang}>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="hi">Hindi</option>
      </select>

      {/* ✅ Target Language Selection */}
      <label>Target Language:</label>
      <select onChange={(e) => setTargetLang(e.target.value)} value={targetLang}>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="hi">Hindi</option>
      </select>

      <button onClick={translateText} disabled={loading}>
        {loading ? "Translating..." : "Translate"}
      </button>

      {error && <p className="error">{error}</p>}

      <h3>Translated Text:</h3>
      <p className="translated-text">{translatedText || "Translation will appear here..."}</p>
    </div>
  );
};

export default Translation;
