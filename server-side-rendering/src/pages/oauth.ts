import type { APIRoute } from "astro";
import { createAdminClient, SESSION_COOKIE } from "../server/appwrite";

export const POST: APIRoute = async ({ redirect, url }) => {
  const { account } = createAdminClient();

  const redirectUrl = await account.createOAuth2Token(
    "github",
    `${url.origin}/oauth`,
    `${url.origin}/signin`
  );

  return redirect(redirectUrl);
};

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  const userId = url.searchParams.get("userId");
  const secret = url.searchParams.get("secret");

  if (!userId || !secret) {
    throw new Error("OAuth2 did not provide userId or secret");
  }

  const { account } = createAdminClient();

  const session = await account.createSession(userId, secret);
  if (!session || !session.secret) {
    throw new Error("Failed to create session from token");
  }

  cookies.set(SESSION_COOKIE, session.secret, {
    sameSite: "strict",
    expires: new Date(session.expire),
    secure: true,
    httpOnly: true,
    path: "/",
  });

  return redirect("/account");
};
