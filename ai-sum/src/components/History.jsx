import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

const History = ({ history, handleDelete }) => {
  return (
    <motion.section
      className="mt-8 bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Riwayat Ringkasan
      </h2>
      {history.length === 0 ? (
        <motion.p
          className="text-gray-600 italic p-4 text-center border border-dashed border-gray-300 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Tidak ada riwayat ringkasan.
        </motion.p>
      ) : (
        <AnimatePresence>
          <motion.ul className="flex flex-col gap-4">
            {history.map((item, index) => (
              <motion.li
                key={index}
                className="flex justify-between items-start gap-4 p-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex-1">
                  <h3 className="text-gray-800 font-semibold mb-2">
                    Summary {index + 1}:
                  </h3>
                  <div className="prose prose-sm text-gray-700">
                    <ReactMarkdown>{item}</ReactMarkdown>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleDelete(index)}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center gap-1"
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
                  Delete
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </motion.section>
  );
};

export default History;
