import { useState, useEffect } from "react";
import Header from "./components/Header";
import Summarizer from "./components/Summarizer";
import History from "./components/History";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [history, setHistory] = useState([]);
  const [model, setModel] = useState("deepseek/deepseek-chat-v3-0324:free");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load history from localStorage when component first mounts
  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("summaryHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const handleSummarize = async () => {
    if (inputText.trim() === "") return;

    setSummary("");
    setError("");
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new Error(
          "API key tidak ditemukan. Pastikan VITE_OPENROUTER_API_KEY sudah diset."
        );
      }

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "AI Summarizer",
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "user",
                content: `Summarize the following text without any additional answer. Answer in the language the user speaks:\n\n${inputText}`,
              },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401) {
          throw new Error(
            "API key tidak valid atau sudah kedaluwarsa. Periksa kembali API key Anda."
          );
        } else if (response.status === 429) {
          throw new Error(
            "Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat."
          );
        } else if (response.status === 402) {
          throw new Error(
            "Kredit API habis. Silakan top up akun OpenRouter Anda."
          );
        } else {
          throw new Error(
            errorData.error?.message ||
              `Error ${response.status}: ${response.statusText}`
          );
        }
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Response format tidak valid dari API");
      }

      const summaryText = data.choices[0].message.content;

      // Create history entry with timestamp and original text snippet
      const historyEntry = {
        id: Date.now(),
        summary: summaryText,
        originalText:
          inputText.slice(0, 100) + (inputText.length > 100 ? "..." : ""),
        timestamp: new Date().toLocaleString("id-ID"),
        model: model,
      };

      // Update state
      setSummary(summaryText);
      const newHistory = [historyEntry, ...history];
      setHistory(newHistory);

      // Save to localStorage
      localStorage.setItem("summaryHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Error getting summary:", error);
      setError(error.message);
      setSummary("");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setSummary("");
    setError("");
  };

  const handleDelete = (id) => {
    const newHistory = history.filter((item) => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem("summaryHistory", JSON.stringify(newHistory));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("summaryHistory");
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      <Header title="AI Summarizer" />
      <main className="max-w-3xl mx-auto p-4">
        <Summarizer
          inputText={inputText}
          setInputText={setInputText}
          summary={summary}
          handleSummarize={handleSummarize}
          handleReset={handleReset}
          model={model}
          setModel={setModel}
          loading={loading}
          error={error}
        />
        <History
          history={history}
          handleDelete={handleDelete}
          handleClearHistory={handleClearHistory}
        />
      </main>
    </div>
  );
};

export default App;
