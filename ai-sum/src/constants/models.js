export const MODEL_OPTIONS = [
  {
    value: "deepseek/deepseek-chat-v3-0324:free",
    label: "DeepSeek V3",
    description: "Advanced reasoning model with strong performance",
  },
  {
    value: "meta-llama/llama-3.3-70b-instruct:free",
    label: "Llama 3.3 70B Instruct (Meta)",
    description: "Large language model optimized for instruction following",
  },
  {
    value: "google/gemini-2.0-flash-exp:free",
    label: "Gemini Flash 2.0 Experimental (Google)",
    description: "Fast and efficient model for quick responses",
  },
];

export const DEFAULT_MODEL = MODEL_OPTIONS[0].value;
