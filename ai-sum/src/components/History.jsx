import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const History = ({ history, handleDelete, handleClearHistory }) => {
  return (
    <motion.section
      className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-100">Riwayat Ringkasan</h2>
        {history.length > 0 && (
          <motion.button
            onClick={handleClearHistory}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 mt-2 lg:mt-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Hapus Semua
          </motion.button>
        )}
      </div>

      {history.length === 0 ? (
        <motion.div
          className="text-center p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-300 text-lg">Tidak ada riwayat ringkasan</p>
          <p className="text-gray-500 text-sm mt-2">
            Ringkasan yang dibuat akan muncul di sini
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 mb-4">
            Total: {history.length} ringkasan
          </p>
          <AnimatePresence>
            <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
              {history.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors bg-gray-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-100 font-semibold">
                          Ringkasan #{history.length - index}
                        </h3>
                        <div className="flex items-center text-xs text-gray-400 gap-2">
                          {item.timestamp && <span>{item.timestamp}</span>}
                          {item.model && (
                            <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded-full">
                              {item.model.split("/")[1] || item.model}
                            </span>
                          )}
                        </div>
                      </div>

                      {item.originalText && (
                        <div className="mb-3 p-2 bg-gray-700 rounded text-sm">
                          <p className="text-gray-300 font-medium mb-1">
                            Teks asli:
                          </p>
                          <p className="text-gray-300 italic">
                            {item.originalText}
                          </p>
                        </div>
                      )}

                      <div className="prose prose-sm text-gray-300 max-w-none prose-invert">
                        <ReactMarkdown>
                          {typeof item === "string" ? item : item.summary}
                        </ReactMarkdown>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleDelete(item.id || index)}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex items-center gap-1 mt-2 lg:mt-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Hapus ringkasan ini"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Hapus
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
};

History.propTypes = {
  history: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleClearHistory: PropTypes.func.isRequired,
};

export default History;
