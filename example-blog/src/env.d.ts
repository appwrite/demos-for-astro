/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly APPWRITE_ENDPOINT: string;
  readonly APPWRITE_PROJECT_ID: string;
  readonly APPWRITE_APIKEY: string;
  readonly APPWRITE_DB_ID: string;
  readonly APPWRITE_COLLECTION_ID: string;
}