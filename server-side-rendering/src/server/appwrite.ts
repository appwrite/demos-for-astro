import { Client, Account } from "luke-node-appwrite-ssr";

export const SESSION_COOKIE = "my-custom-session";

export function createAppwriteClient(
  request: Request,
  options?: { setKey?: boolean; setSession?: boolean }
) {
  const { setKey = true, setSession = true } = options ?? {};
  const client = new Client()
    .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID);

  /* Set the API key for the client, bypassing rate limiting and enabling
   * Appwrite to return the `secret` property in the sessions objects. */
  if (setKey) {
    client.setKey(import.meta.env.APPWRITE_KEY);
  }

  /* Optional step: set the forwarded headers to record the user's IP address
   * and user agent. */
  const origin = request.headers.get("origin");
  if (origin) {
    client.setForwardedFor(origin);
  }
  const userAgent = request.headers.get("user-agent");
  if (userAgent) {
    client.setForwardedUserAgent(userAgent);
  }

  /* Extract the session from cookies and use it for the client */
  const cookies = parseCookies(request.headers.get("cookie") ?? "");
  const session = cookies.get(SESSION_COOKIE);
  if (session && setSession) {
    client.setSession(session);
  }

  return {
    get account() {
      return new Account(client);
    },
  };
}

function parseCookies(cookies: string): Map<string, string | null> {
  const map = new Map<string, string | null>();
  for (const cookie of cookies.split(";")) {
    const [name, value] = cookie.split("=");
    map.set(name.trim(), value ?? null);
  }
  return map;
}
