import { Client, Account } from "node-appwrite";

export const SESSION_COOKIE = "my-custom-session";

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID);

  client.setKey(import.meta.env.APPWRITE_KEY);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export function createSessionClient(request: Request) {
  const client = new Client()
    .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID);

  const cookies = parseCookies(request.headers.get("cookie") ?? "");
  const session = cookies.get(SESSION_COOKIE);
  if (session) {
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
