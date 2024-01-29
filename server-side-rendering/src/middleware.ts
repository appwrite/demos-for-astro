import { defineMiddleware } from "astro:middleware";
import { createAppwriteClient } from "./server/appwrite";

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  const { account } = createAppwriteClient(request);

  try {
    const user = await account.get();
    locals.user = user && user.$id ? user : undefined;
  } catch {}

  return next();
});
