import { Client, Account } from "luke-node-appwrite-ssr";

export const SESSION_COOKIE = "my-custom-session";

export function createAppwriteClient(
  event: RequestEvent,
  options?: { setKey?: boolean; setSession?: boolean }
) {
  const { setKey = true, setSession = true } = options ?? {};
  const client = new Client()
    .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
    .setProject(PUBLIC_APPWRITE_PROJECT_ID);

  /* Set the API key for the client, bypassing rate limiting and enabling
   * Appwrite to return the `secret` property in the sessions objects. */
  if (setKey) {
    client.setKey(APPWRITE_KEY);
  }

  /* Optional step: set the forwarded headers to record the user's IP address
   * and user agent. */
  const origin = event.request.headers.get("origin");
  if (origin) {
    client.setForwardedFor(origin);
  }
  const userAgent = event.request.headers.get("user-agent");
  if (userAgent) {
    client.setForwardedUserAgent(userAgent);
  }

  /* Extract the session from cookies and use it for the client */
  const session = event.cookies.get(SESSION_COOKIE);
  if (session && setSession) {
    client.setSession(session);
  }

  return {
    get account() {
      return new Account(client);
    },
  };
}
