export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  providerSlug: string;
}

export interface ModelGroup {
  provider: string;
  providerSlug: string;
  models: ModelOption[];
}

export const MODEL_GROUPS: ModelGroup[] = [
  {
    provider: 'Qwen',
    providerSlug: 'custom-qwen',
    models: [
      { id: 'qwen3.8-max', name: 'Qwen 3.8 Max', provider: 'Qwen', providerSlug: 'custom-qwen' },
      { id: 'qwen3.7-max', name: 'Qwen 3.7 Max', provider: 'Qwen', providerSlug: 'custom-qwen' },
      { id: 'qwen3.7-plus', name: 'Qwen 3.7 Plus', provider: 'Qwen', providerSlug: 'custom-qwen' },
      { id: 'qwen3.6-max', name: 'Qwen 3.6 Max', provider: 'Qwen', providerSlug: 'custom-qwen' },
      { id: 'qwen3.6-plus', name: 'Qwen 3.6 Plus', provider: 'Qwen', providerSlug: 'custom-qwen' },
      { id: 'qwen3.6-flash', name: 'Qwen 3.6 Flash', provider: 'Qwen', providerSlug: 'custom-qwen' },
      { id: 'kimi-k2.7-code', name: 'Kimi K2.7 Code', provider: 'Qwen', providerSlug: 'custom-qwen' },
      { id: 'glm-5.2', name: 'GLM 5.2', provider: 'Qwen', providerSlug: 'custom-qwen' },
      { id: 'deepseek-v4-flash-0731', name: 'DeepSeek V4 Flash (0731)', provider: 'Qwen', providerSlug: 'custom-qwen' },
    ],
  },
];

// Single default + fallback, all within Qwen (custom-qwen).
// Frontend no longer sends model selection; backend resolves dynamically.
export const DEFAULT_MODEL_ID = 'qwen3.7-plus';
export const DEFAULT_PROVIDER_SLUG = 'custom-qwen';

export const FALLBACK_MODEL_CHAIN: ModelOption[] = [
  { id: 'qwen3.7-plus', name: 'Qwen 3.7 Plus', provider: 'Qwen', providerSlug: 'custom-qwen' },
  { id: 'qwen3.6-plus', name: 'Qwen 3.6 Plus', provider: 'Qwen', providerSlug: 'custom-qwen' },
  { id: 'deepseek-v4-flash-0731', name: 'DeepSeek V4 Flash (0731)', provider: 'Qwen', providerSlug: 'custom-qwen' },
];

export const ANALYST_MODEL_CHAIN: ModelOption[] = [
  { id: 'qwen3.6-flash', name: 'Qwen 3.6 Flash', provider: 'Qwen', providerSlug: 'custom-qwen' },
  { id: 'qwen3.6-plus', name: 'Qwen 3.6 Plus', provider: 'Qwen', providerSlug: 'custom-qwen' },
];

export const getAllModels = (): ModelOption[] => {
  return MODEL_GROUPS.flatMap((group) => group.models);
};

export const getModelById = (id: string): ModelOption | undefined => {
  return getAllModels().find((m) => m.id === id);
};
