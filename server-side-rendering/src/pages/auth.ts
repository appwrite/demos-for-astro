import type { APIRoute } from "astro";
import { SESSION_COOKIE, createAppwriteClient } from "../server/appwrite";

export const GET: APIRoute = async ({ request, cookies, redirect, url }) => {
  const userId = url.searchParams.get("userId");
  const secret = url.searchParams.get("secret");

  if (!userId || !secret) {
    return Response.redirect("/signin", 302);
  }

  const { account } = createAppwriteClient(request);
  const session = await account.createSession(userId, secret);

  if (!session || !session.secret) {
    return new Response(
      "Create session from token failed - no session or secret",
      { status: 500 }
    );
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
