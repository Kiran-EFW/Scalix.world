import { ipcMain } from "electron";
import type { UserSettings } from "../../lib/schemas";
import { writeSettings } from "../../main/settings";
import { readSettings } from "../../main/settings";

// LiteLLM Configuration
export const SCALIX_LITELLM_CONFIG = {
  BASE_URL: process.env.SCALIX_ENGINE_URL || 'http://localhost:4000',
  MASTER_KEY: process.env.LITELLM_MASTER_KEY || 'sk-scalix-dev-123456789',
  DEFAULT_MODEL: 'gpt-4',
  FALLBACK_MODELS: ['claude-3-opus-20240229', 'scalix-engine'],
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RATE_LIMIT_BUFFER: 0.8, // Use 80% of rate limit
}

export function registerSettingsHandlers() {
  // Intentionally do NOT use handle because it could log sensitive data from the return value.
  ipcMain.handle("get-user-settings", async () => {
    const settings = readSettings();
    return settings;
  });

  // Intentionally do NOT use handle because it could log sensitive data from the args.
  ipcMain.handle(
    "set-user-settings",
    async (_, settings: Partial<UserSettings>) => {
      writeSettings(settings);
      return readSettings();
    },
  );

  // LiteLLM configuration handler
  ipcMain.handle("get-litellm-config", async () => {
    return {
      baseUrl: SCALIX_LITELLM_CONFIG.BASE_URL,
      masterKey: SCALIX_LITELLM_CONFIG.MASTER_KEY,
      defaultModel: SCALIX_LITELLM_CONFIG.DEFAULT_MODEL,
      fallbackModels: SCALIX_LITELLM_CONFIG.FALLBACK_MODELS,
      timeout: SCALIX_LITELLM_CONFIG.TIMEOUT,
      retryAttempts: SCALIX_LITELLM_CONFIG.RETRY_ATTEMPTS,
      rateLimitBuffer: SCALIX_LITELLM_CONFIG.RATE_LIMIT_BUFFER,
    }
  });
}

