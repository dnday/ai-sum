import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const ExportSummary = ({ summary, originalText }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToTxt = () => {
    if (!summary) return;

    setIsExporting(true);

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `ringkasan-${timestamp}.txt`;

      // Create text content with original text and summary
      const content = `RINGKASAN AI\n\n${
        originalText ? "TEKS ASLI:\n" + originalText + "\n\n" : ""
      }RINGKASAN:\n${summary}`;

      // Create a blob and download link
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      // Create and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPdf = () => {
    if (!summary) return;

    setIsExporting(true);

    try {
      // You'll need to install jspdf: npm install jspdf
      import("jspdf").then(({ default: jsPDF }) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `ringkasan-${timestamp}.pdf`;

        const doc = new jsPDF();

        // Add title
        doc.setFontSize(16);
        doc.text("RINGKASAN AI", 20, 20);

        // Add original text if available
        if (originalText) {
          doc.setFontSize(12);
          doc.text("TEKS ASLI:", 20, 30);

          // Split text to fit page width
          const splitOriginal = doc.splitTextToSize(originalText, 170);
          doc.text(splitOriginal, 20, 40);
        }

        // Add summary
        let yPosition = originalText
          ? 40 + Math.min(80, originalText.length / 5)
          : 40;
        doc.setFontSize(12);
        doc.text("RINGKASAN:", 20, yPosition);

        const splitSummary = doc.splitTextToSize(summary, 170);
        doc.text(splitSummary, 20, yPosition + 10);

        // Save the PDF
        doc.save(filename);
        setIsExporting(false);
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <motion.button
        onClick={exportToTxt}
        disabled={!summary || isExporting}
        className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${
          !summary || isExporting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        whileHover={summary && !isExporting ? { scale: 1.03 } : {}}
        whileTap={summary && !isExporting ? { scale: 0.97 } : {}}
      >
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
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Export TXT
      </motion.button>

      <motion.button
        onClick={exportToPdf}
        disabled={!summary || isExporting}
        className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
          !summary || isExporting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        whileHover={summary && !isExporting ? { scale: 1.03 } : {}}
        whileTap={summary && !isExporting ? { scale: 0.97 } : {}}
      >
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
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Export PDF
      </motion.button>

      {isExporting && (
        <span className="flex items-center ml-2 text-gray-500 dark:text-gray-400">
          <svg
            className="animate-spin h-4 w-4 mr-2"
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
          Exporting...
        </span>
      )}
    </div>
  );
};

ExportSummary.propTypes = {
  summary: PropTypes.string,
  originalText: PropTypes.string,
};

export default ExportSummary;
