import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const UrlSummarizer = ({ onTextExtracted, isLoading, setIsLoading }) => {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleExtractText = async () => {
    if (!url) {
      setUrlError("Masukkan URL artikel");
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError("URL tidak valid");
      return;
    }

    setUrlError("");
    setIsLoading(true);

    try {
      // This uses a proxy service to avoid CORS issues
      const response = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching URL: ${response.status}`);
      }

      const html = await response.text();

      // Create a DOM parser to extract text
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Remove script, style, and other non-content elements
      [
        "script",
        "style",
        "nav",
        "footer",
        "header",
        "aside",
        "noscript",
        "svg",
      ].forEach((tag) => {
        const elements = doc.getElementsByTagName(tag);
        for (let i = elements.length - 1; i >= 0; i--) {
          elements[i].remove();
        }
      });

      // Try to find main content areas
      const contentSelectors = [
        "article",
        "main",
        "[role='main']",
        ".content",
        "#content",
        ".post",
        ".article",
        ".entry",
        ".story",
      ];

      let contentElement = null;

      for (const selector of contentSelectors) {
        const elements = doc.querySelectorAll(selector);
        if (elements.length > 0) {
          // Use the largest content element by text length
          contentElement = Array.from(elements).sort(
            (a, b) => b.textContent.length - a.textContent.length
          )[0];
          break;
        }
      }

      // Extract text from content area or fallback to body
      const extracted = contentElement
        ? contentElement.textContent
        : doc.body.textContent;

      // Clean up the text
      const cleanText = extracted
        .replace(/\s+/g, " ")
        .replace(/\n+/g, "\n")
        .trim();

      // Get page title
      const title = doc.title || "";

      // Combine title and text
      const finalText = title ? `${title}\n\n${cleanText}` : cleanText;

      // Pass extracted text back to parent component
      onTextExtracted(finalText);
    } catch (error) {
      console.error("Error extracting text from URL:", error);
      setUrlError(`Gagal mengekstrak teks dari URL: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
        Ringkas dari URL
      </h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/artikel"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
        </div>
        <motion.button
          onClick={handleExtractText}
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          whileHover={{ scale: isLoading ? 1 : 1.03 }}
          whileTap={{ scale: isLoading ? 1 : 0.97 }}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Mengekstrak...</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              <span>Ekstrak Teks</span>
            </>
          )}
        </motion.button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Masukkan URL artikel untuk mengekstrak dan meringkas kontennya secara
        otomatis.
      </p>
    </motion.div>
  );
};

UrlSummarizer.propTypes = {
  onTextExtracted: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};

export default UrlSummarizer;
