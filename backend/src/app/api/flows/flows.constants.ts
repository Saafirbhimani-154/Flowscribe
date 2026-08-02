export const FLOWS_CONSTANTS = {
  PROVIDERS: {
    OPENROUTER: 'openrouter',
    OPENAI: 'openai',
  },
  URLS: {
    OPENROUTER_BASE: 'https://openrouter.ai/api/v1/chat/completions',
    OPENAI_BASE: 'https://api.openai.com/v1/chat/completions',
  },
  DEFAULT_MODEL: 'google/gemini-pro-vision',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
};

export const FLOWS_MESSAGES = {
  ERROR: {
    NO_INPUT: 'Please provide either an image or a text description to generate a flow.',
    NO_IMAGES: 'No images uploaded.',
    INVALID_JSON_VISION: 'LLM returned invalid JSON structure from vision extraction.',
    INVALID_JSON_QUESTIONS: 'Failed to parse questions JSON.',
    INVALID_JSON_AUDIT: 'Failed to parse audit JSON.',
    INVALID_JSON_DIAGRAMS: 'Failed to parse diagrams JSON.',
    SESSION_REQUIRED: 'sessionData is required.',
    API_KEY_MISSING: 'LLM_API_KEY is not defined in the environment.',
  }
};
