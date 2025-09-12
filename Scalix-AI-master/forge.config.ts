import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";

// Based on https://github.com/electron/forge/blob/6b2d547a7216c30fde1e1fddd1118eee5d872945/packages/plugin/vite/src/VitePlugin.ts#L124
const ignore = (file: string) => {
  if (!file) return false;
  // `file` always starts with `/`
  // @see - https://github.com/electron/packager/blob/v18.1.3/src/copy-filter.ts#L89-L93
  if (file === "/node_modules") {
    return false;
  }
  if (file.startsWith("/drizzle")) {
    return false;
  }
  if (file.startsWith("/scaffold")) {
    return false;
  }

  if (file.startsWith("/worker") && !file.startsWith("/workers")) {
    return false;
  }
  if (file.startsWith("/node_modules/stacktrace-js")) {
    return false;
  }
  if (file.startsWith("/node_modules/stacktrace-js/dist")) {
    return false;
  }
  if (file.startsWith("/node_modules/better-sqlite3")) {
    return false;
  }
  if (file.startsWith("/node_modules/bindings")) {
    return false;
  }
  if (file.startsWith("/node_modules/file-uri-to-path")) {
    return false;
  }
  if (file.startsWith("/.vite")) {
    return false;
  }

  return true;
};

const isEndToEndTestBuild = process.env.E2E_TEST_BUILD === "true";

const config: ForgeConfig = {
  packagerConfig: {
    protocols: [
      {
        name: "Scalix",
        schemes: ["scalix"],
      },
    ],
    icon: "./assets/icon/logo",

    osxSign: isEndToEndTestBuild
      ? undefined
      : {
          identity: process.env.APPLE_TEAM_ID,
        },
    osxNotarize: isEndToEndTestBuild
      ? undefined
      : {
          appleId: process.env.APPLE_ID!,
          appleIdPassword: process.env.APPLE_PASSWORD!,
          teamId: process.env.APPLE_TEAM_ID!,
        },
    asar: true,
    ignore,
    // ignore: [/node_modules\/(?!(better-sqlite3|bindings|file-uri-to-path)\/)/],
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: "scalix",
      exe: "scalix.exe",
      setupExe: "Scalix-Setup-0.21.0.exe",
      setupIcon: "./assets/icon/logo.ico",
      iconUrl: "https://raw.githubusercontent.com/scalix-world/scalix/main/assets/icon/logo.ico",
      loadingGif: "./assets/icon/logo.ico",
      noMsi: true,
      remoteReleases: undefined, // Disable remote releases for offline build
      // Disable code signing for development builds
      signWithParams: undefined,
      authors: "Kiran Ravi",
      description: "Free, local, open-source AI app builder - Build AI applications with ease",
      copyright: "© 2025 Kiran Ravi. All rights reserved.",
      version: "0.21.0",
      // Enhanced Windows installer options (disabled for development)
      // certificateFile: process.env.WINDOWS_CERTIFICATE_FILE,
      // certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD,
      // Desktop and Start Menu shortcuts
      shortcutName: "Scalix",
      // Custom installer resources
      // artifactName: "Scalix-Setup-${version}.exe",
      // Windows-specific configuration
      appDirectory: "/opt/${name}", // Though this is for Windows, keeping consistent
      // Additional metadata for Add/Remove Programs
      scope: "perMachine", // Install for all users
      // Custom installer scripts (if needed)
      // nsisScript: "./installer-resources/installer.nsi",
    }),
    new MakerDMG({
      name: "Scalix",
      icon: "./assets/icon/logo.icns",
      format: "ULFO",
      contents: [
        {
          x: 130,
          y: 220,
        },
        {
          x: 410,
          y: 220,
          type: "link",
          path: "/Applications",
        },
      ],
      window: {
        width: 540,
        height: 380,
      },
      additionalDMGOptions: {
        codeSigning: !isEndToEndTestBuild,
        codeSignIdentity: process.env.APPLE_TEAM_ID,
      },
    }),
    new MakerRpm({}),
    new MakerDeb({
      options: {
        mimeType: ["x-scheme-handler/scalix"],
      },
    }),
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "scalix-world",
          name: "scalix",
        },
        draft: true,
        force: true,
        prerelease: true,
      },
    },
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: "src/main.ts",
          config: "vite.main.config.mts",
          target: "main",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.mts",
          target: "preload",
        },
        {
          entry: "workers/tsc/tsc_worker.ts",
          config: "vite.worker.config.mts",
          target: "main",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.mts",
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: isEndToEndTestBuild,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
