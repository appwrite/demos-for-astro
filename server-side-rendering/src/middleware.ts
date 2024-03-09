import { defineMiddleware } from "astro:middleware";
import { createSessionClient } from "./server/appwrite";

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  try {
    const { account } = createSessionClient(request);
    locals.user = await account.get();
  } catch {}

  return next();
});
