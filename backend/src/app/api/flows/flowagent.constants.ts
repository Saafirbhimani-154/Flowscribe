export interface AgentConfig {
  mainModel: string;
  fallbackModel: string;
  mainKeyEnv: string;
  fallbackKeyEnv: string;
  mainBaseUrl: string;
  fallbackBaseUrl: string;
}

export const AGENTS = {
  ORCHESTRATOR: {
    mainModel: 'meta/llama-3.2-90b-vision-instruct',
    fallbackModel: 'microsoft/phi-3-vision-128k-instruct',
    mainKeyEnv: 'NVIDIA_ORCHESTRATOR_MAIN',
    fallbackKeyEnv: 'NVIDIA_ORCHESTRATOR_FALLBACK',
    mainBaseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    fallbackBaseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions'
  },
  ILLUSTRATOR: {
    mainModel: 'meta/llama-3.1-70b-instruct',
    fallbackModel: 'google/gemma-2-27b-it',
    mainKeyEnv: 'NVIDIA_ILLUSTRATOR_MAIN',
    fallbackKeyEnv: 'NVIDIA_ILLUSTRATOR_FALLBACK',
    mainBaseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    fallbackBaseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions'
  },
  WRITER: {
    mainModel: 'meta/llama-3.1-70b-instruct',
    fallbackModel: 'google/gemma-2-27b-it',
    mainKeyEnv: 'NVIDIA_WRITER_MAIN',
    fallbackKeyEnv: 'NVIDIA_WRITER_FALLBACK',
    mainBaseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    fallbackBaseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions'
  },
  PAPERWORKER: {
    mainModel: 'meta/llama-3.1-8b-instruct',
    fallbackModel: 'nvidia/nemotron-4-340b-instruct',
    mainKeyEnv: 'NVIDIA_PAPERWORKER_MAIN',
    fallbackKeyEnv: 'NVIDIA_PAPERWORKER_FALLBACK',
    mainBaseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    fallbackBaseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions'
  }
};
