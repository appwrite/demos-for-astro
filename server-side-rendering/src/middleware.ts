import { defineMiddleware } from "astro:middleware";
import { createSessionClient } from "./server/appwrite";

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  const { account } = createSessionClient(request);

  try {
    locals.user = await account.get();
  } catch {}

  return next();
});
