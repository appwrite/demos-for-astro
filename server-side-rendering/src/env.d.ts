/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?:
      | import("luke-node-appwrite-ssr").Models.User<
          import("luke-node-appwrite-ssr").Models.Preferences<{}>
        >
      | null;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_APPWRITE_ENDPOINT: string;
  readonly PUBLIC_APPWRITE_PROJECT_ID: string;
  readonly APPWRITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
