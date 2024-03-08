/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?:
      | import("node-appwrite").Models.User<
          import("node-appwrite").Models.Preferences<{}>
        >;
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
