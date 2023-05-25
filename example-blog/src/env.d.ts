/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APPWRITE_ENDPOINT: string;
  readonly PUBLIC_APPWRITE_PROJECT_ID: string;
  readonly PUBLIC_APPWRITE_DB_ID: string;
  readonly PUBLIC_APPWRITE_POSTS_ID: string;
  readonly PUBLIC_APPWRITE_COMMENTS_ID: string;
  readonly PUBLIC_APPWRITE_BUCKET_ID: string;
}
