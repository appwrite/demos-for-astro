import type { APIRoute } from "astro";
import { createAdminClient, SESSION_COOKIE } from "../server/appwrite";

export const POST: APIRoute = async ({ redirect, url }) => {
  const { account } = createAdminClient();

  const redirectUrl = await account.createOAuth2Token(
    "github",
    `${url.protocol}//${url.hostname}/oauth`,
    `${url.protocol}//${url.hostname}/sigin`
  );

  return redirect(redirectUrl);
};

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  const userId = url.searchParams.get("userId");
  const secret = url.searchParams.get("secret");

  const { account } = createAdminClient();
  const session = await account.createSession(userId, secret);

  cookies.set(SESSION_COOKIE, session.secret, {
    sameSite: "strict",
    expires: new Date(session.expire),
    secure: true,
    httpOnly: true,
    path: "/",
  });

  return redirect("/account");
};
