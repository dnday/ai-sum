import { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { MODEL_OPTIONS } from "../constants/models";
import { useAnimationVariants } from "../hooks/useAnimationVariants";

// Reusable Components
const LoadingSpinner = ({ size = "w-4 h-4", className = "" }) => (
  <svg
    className={`animate-spin ${size} ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

LoadingSpinner.propTypes = {
  size: PropTypes.string,
  className: PropTypes.string,
};

const ErrorMessage = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <motion.div
      className="bg-gray-800 border border-red-400/30 rounded-lg p-4 mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-300">Error</h3>
          <p className="mt-1 text-sm text-red-200">{error}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex rounded-md p-1.5 text-red-300 hover:bg-gray-700 transition-colors"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.string,
  onDismiss: PropTypes.func,
};

const ModelSelector = ({ model, setModel, loading, variants }) => (
  <motion.div className="flex justify-center" variants={variants}>
    <div className="flex flex-col items-center space-y-2">
      <label
        htmlFor="model-select"
        className="text-sm font-medium text-gray-300"
      >
        Pilih Model AI
      </label>
      <select
        id="model-select"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        disabled={loading}
        className="p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[250px] shadow-lg"
        aria-label="Pilih model AI untuk meringkas teks"
      >
        {MODEL_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </motion.div>
);

ModelSelector.propTypes = {
  model: PropTypes.string.isRequired,
  setModel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  variants: PropTypes.object.isRequired,
};

const ActionButton = ({
  onClick,
  disabled,
  variant = "primary",
  children,
  ariaLabel,
}) => {
  const baseClasses =
    "px-6 py-3 rounded-xl transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700",
    secondary:
      "bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600",
  };

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
};

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string,
};

const SummaryResult = ({ summary, loading, error, fadeInVariants }) => {
  if (error) {
    return (
      <div className="text-red-300 p-4 bg-gray-800 rounded-lg border border-red-400/30">
        <p className="font-medium">Terjadi kesalahan:</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-8"
        role="status"
        aria-live="polite"
      >
        <motion.div
          className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />
        <span className="ml-3 text-lg text-gray-300">
          Memproses ringkasan...
        </span>
      </div>
    );
  }

  if (summary) {
    return (
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-800 border border-indigo-500/30 rounded-lg p-4"
      >
        <div className="flex items-center mb-2">
          <svg
            className="h-5 w-5 text-indigo-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-indigo-300 font-medium">
            Ringkasan berhasil dibuat
          </span>
        </div>
        <div className="prose max-w-none prose-invert prose-headings:text-gray-200 prose-p:text-gray-300">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </motion.div>
    );
  }

  return (
    <p className="text-gray-400 italic p-4 text-center">
      Hasil ringkasan teks akan muncul di sini setelah proses ringkasan selesai.
    </p>
  );
};

SummaryResult.propTypes = {
  summary: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  fadeInVariants: PropTypes.object.isRequired,
};

const Summarizer = ({
  inputText,
  setInputText,
  summary,
  handleSummarize,
  handleReset,
  model,
  setModel,
  loading,
  error,
}) => {
  // Custom hook for animation variants
  const { containerVariants, itemVariants } = useAnimationVariants();

  // Memoized handlers to prevent unnecessary re-renders
  const handleTextChange = useCallback(
    (e) => {
      setInputText(e.target.value);
    },
    [setInputText]
  );

  const handleSummarizeClick = useCallback(() => {
    if (inputText.trim() && !loading) {
      handleSummarize();
    }
  }, [inputText, loading, handleSummarize]);

  const isSubmitDisabled = loading || !inputText.trim();

  return (
    <motion.div
      className="space-y-6 max-w-4xl mx-auto p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-xl font-medium text-gray-200 text-center"
        variants={itemVariants}
      >
        Masukkan teks untuk diringkas:
      </motion.h1>

      <ModelSelector
        model={model}
        setModel={setModel}
        loading={loading}
        variants={itemVariants}
      />

      <motion.div variants={itemVariants}>
        <ErrorMessage error={error} />
      </motion.div>

      <motion.div
        className="flex flex-col lg:flex-row gap-4"
        variants={itemVariants}
      >
        <div className="flex-1">
          <label
            htmlFor="input-text"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Teks yang akan diringkas
          </label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={handleTextChange}
            className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-vertical text-gray-200"
            rows="6"
            placeholder="Masukkan teks di sini..."
            disabled={loading}
            aria-describedby="input-help"
          />
          <p id="input-help" className="mt-1 text-sm text-gray-400">
            Masukkan teks yang ingin Anda ringkas menggunakan AI
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-3">
          <ActionButton
            onClick={handleSummarizeClick}
            disabled={isSubmitDisabled}
            variant="primary"
            ariaLabel="Ringkas teks yang telah dimasukkan"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner className="-ml-1 mr-2 text-white" />
                Meringkas...
              </span>
            ) : (
              "Ringkas"
            )}
          </ActionButton>

          <ActionButton
            onClick={handleReset}
            disabled={loading}
            variant="secondary"
            ariaLabel="Reset form dan hapus semua teks"
          >
            Reset
          </ActionButton>
        </div>
      </motion.div>

      <motion.section
        className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700"
        variants={itemVariants}
        role="region"
        aria-labelledby="summary-heading"
      >
        <h2
          id="summary-heading"
          className="text-2xl font-semibold mb-4 text-gray-200"
        >
          Hasil Ringkasan
        </h2>
        <div className="text-gray-300">
          <SummaryResult
            summary={summary}
            loading={loading}
            error={error}
            fadeInVariants={itemVariants}
          />
        </div>
      </motion.section>
    </motion.div>
  );
};

Summarizer.propTypes = {
  inputText: PropTypes.string.isRequired,
  setInputText: PropTypes.func.isRequired,
  summary: PropTypes.string,
  handleSummarize: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  model: PropTypes.string.isRequired,
  setModel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default Summarizer;
