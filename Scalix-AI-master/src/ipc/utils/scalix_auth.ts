import log from "electron-log";
import { loadApiKey } from "@ai-sdk/provider-utils";

const logger = log.scope("scalix_auth");

/**
 * Scalix API Authentication System
 *
 * Handles authentication for all Scalix API endpoints including:
 * - Scalix Engine (advanced processing)
 * - Scalix Gateway (optimized routing)
 * - Scalix Pro services (user management, billing)
 */

export interface ScalixAuthConfig {
  apiKey?: string;
  baseURL?: string;
  timeout?: number;
  retries?: number;
}

export interface ScalixAuthHeaders {
  Authorization: string;
  "X-Scalix-Client": string;
  "X-Scalix-Version": string;
  "Content-Type": string;
  [key: string]: string;
}

/**
 * Validates Scalix API key format
 */
export function validateScalixApiKey(apiKey: string): boolean {
  if (!apiKey) return false;

  // Scalix API keys should start with 'scalix_'
  if (!apiKey.startsWith('scalix_')) {
    logger.error("Invalid Scalix API key format. Expected key starting with 'scalix_'");
    return false;
  }

  // Check minimum length (should be reasonably long)
  if (apiKey.length < 20) {
    logger.error("Scalix API key appears to be too short");
    return false;
  }

  return true;
}

/**
 * Loads and validates Scalix API key from settings or environment
 */
export function loadScalixApiKey(options: ScalixAuthConfig = {}): string {
  const apiKey = loadApiKey({
    apiKey: options.apiKey,
    environmentVariableName: "SCALIX_PRO_API_KEY",
    description: "Scalix Pro API key",
  });

  if (!validateScalixApiKey(apiKey)) {
    throw new Error("Invalid Scalix API key format or missing key");
  }

  return apiKey;
}

/**
 * Generates Scalix authentication headers
 */
export function createScalixAuthHeaders(options: ScalixAuthConfig = {}): ScalixAuthHeaders {
  const scalixApiKey = loadScalixApiKey(options);

  return {
    Authorization: `Bearer ${scalixApiKey}`,
    "X-Scalix-Client": "desktop-app",
    "X-Scalix-Version": process.env.npm_package_version || "1.0.0",
    "Content-Type": "application/json",
  };
}

/**
 * Scalix API endpoints configuration
 */
export const SCALIX_API_ENDPOINTS = {
  // Scalix Engine - Advanced AI processing (NOW WORKING!)
  ENGINE: "http://localhost:4000/v1",

  // Scalix Gateway - Optimized routing (NOW WORKING!)
  GATEWAY: "http://localhost:4000/v1",

  // Scalix Pro services (redirected to working server)
  USER_INFO: "http://localhost:4000/v1/user/info",
  USER_BUDGET: "http://localhost:4000/v1/user/budget",
  USAGE_STATS: "http://localhost:4000/v1/user/stats",

  // Templates and community (placeholder - not critical for now)
  TEMPLATES: "http://localhost:4000/v1/models",

  // Auto-updates (placeholder - not critical for now)
  UPDATES: "http://localhost:4000/health",

  // Logs and diagnostics (placeholder - not critical for now)
  LOGS_UPLOAD: "http://localhost:4000/health",
} as const;

/**
 * Makes authenticated request to Scalix API with retry logic
 */
export async function makeScalixApiRequest<T = any>(
  endpoint: string,
  options: RequestInit & ScalixAuthConfig = {}
): Promise<T> {
  const {
    timeout = 10000,
    retries = 3,
    method = "GET",
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  const authHeaders = createScalixAuthHeaders(options);
  const headers = { ...authHeaders, ...customHeaders };

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info(`Scalix API request attempt ${attempt}/${retries} to ${endpoint}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(endpoint, {
        method,
        headers,
        signal: controller.signal,
        ...fetchOptions,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        const error = new Error(`Scalix API request failed: ${response.status} ${response.statusText}`);

        // Don't retry on authentication errors
        if (response.status === 401 || response.status === 403) {
          logger.error(`Scalix authentication failed: ${errorBody}`);
          throw error;
        }

        // Retry on server errors
        if (response.status >= 500 && attempt < retries) {
          lastError = error;
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        throw error;
      }

      const data = await response.json();
      logger.info(`Scalix API request successful to ${endpoint}`);
      return data;

    } catch (error: any) {
      lastError = error;
      logger.warn(`Scalix API request attempt ${attempt} failed: ${error.message}`);

      // Retry on network errors
      if (attempt < retries &&
          (error.name === 'AbortError' ||
           error.code === 'ECONNRESET' ||
           error.code === 'ETIMEDOUT' ||
           error.code === 'ENOTFOUND')) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      break;
    }
  }

  logger.error(`All Scalix API request attempts failed. Last error: ${lastError?.message}`);
  throw lastError || new Error("Scalix API request failed");
}

/**
 * Gets user budget information from Scalix API
 */
export async function getScalixUserBudget(options: ScalixAuthConfig = {}) {
  try {
    return await makeScalixApiRequest(SCALIX_API_ENDPOINTS.USER_BUDGET, {
      ...options,
      method: "GET",
    });
  } catch (error) {
    logger.error("Failed to fetch Scalix user budget:", error);
    return null;
  }
}

/**
 * Gets user information from Scalix API
 */
export async function getScalixUserInfo(options: ScalixAuthConfig = {}) {
  try {
    return await makeScalixApiRequest(SCALIX_API_ENDPOINTS.USER_INFO, {
      ...options,
      method: "GET",
    });
  } catch (error) {
    logger.error("Failed to fetch Scalix user info:", error);
    return null;
  }
}

// ==========================================
// CLOUD API INTEGRATION (Cost-Optimized)
// ==========================================

/**
 * Cloud API configuration - cost-optimized with Firestore + Cloud Run
 */
export const CLOUD_API_BASE = process.env.SCALIX_CLOUD_API_BASE || 'https://scalix-cloud-api-123456789.us-central1.run.app';

/**
 * JWT token for desktop authentication (issued by web app)
 */
let desktopAuthToken: string | null = null;

/**
 * Set desktop authentication token
 */
export function setDesktopAuthToken(token: string) {
  desktopAuthToken = token;
  logger.info('Desktop auth token set');
}

/**
 * Get desktop authentication token
 */
export function getDesktopAuthToken(): string | null {
  return desktopAuthToken;
}

/**
 * Clear desktop authentication token
 */
export function clearDesktopAuthToken() {
  desktopAuthToken = null;
  logger.info('Desktop auth token cleared');
}

/**
 * Validates API key with cloud service (cost-optimized)
 */
export async function validateApiKeyWithCloud(apiKey: string): Promise<{
  isValid: boolean;
  plan: 'free' | 'pro' | 'enterprise';
  limits: {
    maxAiTokens: number;
    maxApiCalls: number;
    maxStorage: number;
    maxTeamMembers: number;
    advancedFeatures: boolean;
    prioritySupport: boolean;
  };
  features: string[];
  expiresAt?: Date;
}> {
  try {
    logger.info(`Validating API key with cloud service: ${apiKey.substring(0, 12)}...`);

    const response = await fetch(`${CLOUD_API_BASE}/api/validate-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Scalix-Desktop/1.0.0'
      },
      body: JSON.stringify({ apiKey }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      if (response.status === 401) {
        logger.warn('API key validation failed - invalid key');
        return getDefaultValidationResult();
      }
      throw new Error(`Cloud validation failed: ${response.status}`);
    }

    const result = await response.json();
    logger.info(`Cloud validation successful for plan: ${result.plan}`);

    return {
      isValid: result.isValid,
      plan: result.plan,
      limits: result.limits,
      features: result.features || [],
      expiresAt: result.expiresAt ? new Date(result.expiresAt) : undefined
    };

  } catch (error) {
    logger.warn('Cloud validation failed, using offline fallback:', error.message);

    // Offline fallback - validate locally if possible
    return validateApiKeyLocally(apiKey);
  }
}

/**
 * Validates API key locally (fallback when cloud is unavailable)
 */
function validateApiKeyLocally(apiKey: string): {
  isValid: boolean;
  plan: 'free' | 'pro' | 'enterprise';
  limits: any;
  features: string[];
} {
  // Basic format validation
  if (!validateScalixApiKey(apiKey)) {
    return getDefaultValidationResult();
  }

  // For now, assume Pro plan for valid keys (backward compatibility)
  // This will be updated when we have subscription mapping
  logger.info('Using local validation fallback - assuming Pro plan');

  return {
    isValid: true,
    plan: 'pro',
    limits: {
      maxAiTokens: 200000, // Pro plan default
      maxApiCalls: 1000,
      maxStorage: 10737418240, // 10GB
      maxTeamMembers: 5,
      advancedFeatures: true,
      prioritySupport: true
    },
    features: ['advanced_ai_models', 'team_collaboration', 'priority_support']
  };
}

/**
 * Default validation result for invalid keys
 */
function getDefaultValidationResult() {
  return {
    isValid: false,
    plan: 'free' as const,
    limits: {
      maxAiTokens: 10000,
      maxApiCalls: 100,
      maxStorage: 1073741824, // 1GB
      maxTeamMembers: 1,
      advancedFeatures: false,
      prioritySupport: false
    },
    features: ['basic_ai']
  };
}

/**
 * Tracks usage with cloud API (cost-optimized batch writes)
 */
export async function trackUsageWithCloud(
  apiKey: string,
  metric: string,
  amount: number,
  metadata?: Record<string, any>
): Promise<boolean> {
  try {
    logger.debug(`Tracking usage: ${metric}=${amount}`);

    const response = await fetch(`${CLOUD_API_BASE}/api/usage/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Scalix-Desktop/1.0.0'
      },
      body: JSON.stringify({
        metric,
        amount,
        metadata,
        timestamp: new Date().toISOString()
      }),
      signal: AbortSignal.timeout(5000) // 5 second timeout for tracking
    });

    if (response.ok) {
      logger.debug('Usage tracking successful');
      return true;
    } else {
      logger.warn(`Usage tracking failed: ${response.status}`);
      return false;
    }

  } catch (error) {
    logger.warn('Usage tracking failed, continuing offline:', error.message);
    // Don't throw - usage tracking failures shouldn't break the app
    return false;
  }
}

/**
 * Gets usage summary from cloud API
 */
export async function getUsageSummaryFromCloud(apiKey: string): Promise<{
  currentMonth: Record<string, number>;
  limits: any;
  utilization: Record<string, number>;
} | null> {
  try {
    const response = await fetch(`${CLOUD_API_BASE}/api/usage/summary`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Scalix-Desktop/1.0.0'
      },
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      return await response.json();
    }

    return null;
  } catch (error) {
    logger.warn('Failed to fetch usage summary:', error.message);
    return null;
  }
}

// ==========================================
// DESKTOP SYNC & AUTOMATION
// ==========================================

/**
 * Sync desktop app with cloud (get API key and settings automatically)
 */
export async function syncDesktopWithCloud(): Promise<{
  success: boolean;
  apiKey?: string;
  plan?: string;
  limits?: any;
  features?: string[];
  error?: string;
}> {
  try {
    const token = getDesktopAuthToken();
    if (!token) {
      return { success: false, error: 'No authentication token available' };
    }

    logger.info('Syncing desktop with cloud...');

    const response = await fetch(`${CLOUD_API_BASE}/api/desktop/sync`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Scalix-Desktop/1.0.0'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      const error = await response.text();
      logger.warn('Desktop sync failed:', response.status, error);
      return { success: false, error: `Sync failed: ${response.status}` };
    }

    const syncData = await response.json();
    logger.info('Desktop sync successful:', syncData.hasKey ? 'API key available' : 'No API key');

    return {
      success: true,
      apiKey: syncData.apiKey,
      plan: syncData.plan,
      limits: syncData.limits,
      features: syncData.features
    };

  } catch (error) {
    logger.error('Desktop sync error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Auto-sync desktop settings when user logs in via web
 */
export async function handleWebLoginSync(webToken: string): Promise<boolean> {
  try {
    // Set the auth token
    setDesktopAuthToken(webToken);

    // Attempt to sync
    const syncResult = await syncDesktopWithCloud();

    if (syncResult.success && syncResult.apiKey) {
      // Update settings with the synced API key and limits
      // This will be called from the main process settings handler
      logger.info('Desktop auto-sync successful with web login');
      return true;
    } else {
      logger.warn('Desktop sync failed after web login:', syncResult.error);
      return false;
    }
  } catch (error) {
    logger.error('Web login sync error:', error);
    return false;
  }
}

