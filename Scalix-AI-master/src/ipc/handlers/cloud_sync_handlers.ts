import log from "electron-log";
import { IpcMain } from "electron";
import { createLoggedHandler } from "./safe_handle";
import { readSettings, writeSettings } from "../../main/settings";
import {
  syncDesktopWithCloud,
  handleWebLoginSync,
  setDesktopAuthToken,
  clearDesktopAuthToken,
  getDesktopAuthToken
} from "../utils/scalix_auth";

const logger = log.scope("cloud_sync_handlers");
const handle = createLoggedHandler(logger);

export function registerCloudSyncHandlers() {
  /**
   * Sync desktop with cloud to get API key and settings
   */
  handle("cloud:sync-desktop", async (): Promise<{
    success: boolean;
    apiKey?: string;
    plan?: string;
    limits?: any;
    features?: string[];
    error?: string;
  }> => {
    logger.info("Starting desktop cloud sync...");

    try {
      const syncResult = await syncDesktopWithCloud();

      if (syncResult.success && syncResult.apiKey) {
        // Update settings with synced data
        const currentSettings = readSettings();
        const updatedSettings = {
          ...currentSettings,
          providerSettings: {
            ...currentSettings.providerSettings,
            auto: {
              ...currentSettings.providerSettings?.auto,
              apiKey: {
                value: syncResult.apiKey,
                encryptionType: "plaintext" as const
              }
            }
          },
          proFeatures: {
            ...currentSettings.proFeatures,
            lastValidated: new Date().toISOString(),
            currentPlan: syncResult.plan,
            usageLimits: syncResult.limits,
            features: syncResult.features
          },
          cloudSyncEnabled: true,
          lastCloudSync: new Date().toISOString()
        };

        writeSettings(updatedSettings);
        logger.info("Desktop sync successful - settings updated");
      }

      return syncResult;
    } catch (error) {
      logger.error("Desktop sync failed:", error);
      return { success: false, error: error.message };
    }
  });

  /**
   * Handle web login sync (called when user logs in via web interface)
   */
  handle("cloud:web-login-sync", async (_event, webToken: string): Promise<{
    success: boolean;
    error?: string;
  }> => {
    logger.info("Processing web login sync...");

    try {
      const success = await handleWebLoginSync(webToken);

      if (success) {
        // Trigger immediate desktop sync
        const syncResult = await syncDesktopWithCloud();
        if (syncResult.success) {
          // Update settings with synced data
          const currentSettings = readSettings();
          const updatedSettings = {
            ...currentSettings,
            providerSettings: {
              ...currentSettings.providerSettings,
              auto: {
                ...currentSettings.providerSettings?.auto,
                apiKey: {
                  value: syncResult.apiKey,
                  encryptionType: "plaintext" as const
                }
              }
            },
            proFeatures: {
              ...currentSettings.proFeatures,
              lastValidated: new Date().toISOString(),
              currentPlan: syncResult.plan,
              usageLimits: syncResult.limits,
              features: syncResult.features
            },
            cloudSyncEnabled: true,
            lastCloudSync: new Date().toISOString()
          };

          writeSettings(updatedSettings);
          logger.info("Web login sync successful - API key auto-configured");
        }
      }

      return { success };
    } catch (error) {
      logger.error("Web login sync failed:", error);
      return { success: false, error: error.message };
    }
  });

  /**
   * Set desktop authentication token
   */
  handle("cloud:set-auth-token", async (_event, token: string): Promise<boolean> => {
    try {
      setDesktopAuthToken(token);
      logger.info("Desktop auth token set");
      return true;
    } catch (error) {
      logger.error("Failed to set auth token:", error);
      return false;
    }
  });

  /**
   * Clear desktop authentication token
   */
  handle("cloud:clear-auth-token", async (): Promise<boolean> => {
    try {
      clearDesktopAuthToken();
      logger.info("Desktop auth token cleared");
      return true;
    } catch (error) {
      logger.error("Failed to clear auth token:", error);
      return false;
    }
  });

  /**
   * Get desktop authentication status
   */
  handle("cloud:get-auth-status", async (): Promise<{
    hasToken: boolean;
    lastSync?: string;
    cloudSyncEnabled: boolean;
  }> => {
    const token = getDesktopAuthToken();
    const settings = readSettings();

    return {
      hasToken: !!token,
      lastSync: settings.lastCloudSync,
      cloudSyncEnabled: settings.cloudSyncEnabled || false
    };
  });

  /**
   * Manual trigger for cloud sync
   */
  handle("cloud:trigger-sync", async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    logger.info("Manual cloud sync triggered");

    try {
      const syncResult = await syncDesktopWithCloud();

      if (syncResult.success) {
        // Update settings
        const currentSettings = readSettings();
        const updatedSettings = {
          ...currentSettings,
          lastCloudSync: new Date().toISOString(),
          ...(syncResult.apiKey && {
            providerSettings: {
              ...currentSettings.providerSettings,
              auto: {
                ...currentSettings.providerSettings?.auto,
                apiKey: {
                  value: syncResult.apiKey,
                  encryptionType: "plaintext" as const
                }
              }
            }
          })
        };

        writeSettings(updatedSettings);
        logger.info("Manual cloud sync successful");
      }

      return {
        success: syncResult.success,
        error: syncResult.error
      };
    } catch (error) {
      logger.error("Manual cloud sync failed:", error);
      return { success: false, error: error.message };
    }
  });
}
