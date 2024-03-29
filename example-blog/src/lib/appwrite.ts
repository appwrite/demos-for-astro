import {
  Account,
  AppwriteException,
  Client,
  Databases,
  Storage,
  ID,
  type Models,
  Teams,
  Query,
} from "appwrite";
import { atom, WritableAtom } from "nanostores";

/** Setup */
export const appwriteClient = new Client()
  .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT) // Your API Endpoint
  .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID); // Your project ID

export const appwriteDatabases = new Databases(appwriteClient);
export const appwriteStorage = new Storage(appwriteClient);
export const appwriteTeams = new Teams(appwriteClient);

/** Database */
export interface BlogPost extends Models.Document {
  title: string;
  description: string;
  content: string;
  slug: string;
  imageUrl: string;
}
export interface BlogPostList extends Models.DocumentList<BlogPost> {}

export interface BlogComment extends Models.Document {
  postId: string;
  content: string;
}
export interface BlogCommentList extends Models.DocumentList<BlogComment> {}

/** Account */
export const appwriteAccount = new Account(appwriteClient);
export const isLoggedIn: WritableAtom<undefined | Models.Session> =
  atom(undefined);
export const isAuthor: WritableAtom<boolean> = atom(false);

// Check for session
appwriteAccount.getSession("current").then(
  function (response) {
    isLoggedIn.set(response);
  },
  function (error) {
    isLoggedIn.set(undefined);
  }
);

export const user$: WritableAtom<undefined | Models.User<Models.Preferences>> =
  atom(undefined);

isLoggedIn.subscribe(async (session) => {
  if (session?.userId) {
    user$.set(await account());
  }
});

isLoggedIn.subscribe(async (session) => {
  if (!session?.userId) return;
  const authorsMemberships = await appwriteTeams.listMemberships("authors", [
    Query.equal("userId", session.userId),
  ]);
  isAuthor.set(authorsMemberships.total > 0);
});

export const login = async (email: string, password: string) => {
  try {
    const session = await appwriteAccount.createEmailSession(email, password);
    isLoggedIn.set(session);
    window.location.href = "/account";
  } catch (error) {
    const appwriteError = error as AppwriteException;
    alert(appwriteError.message);
  }
};

export const logout = async () => {
  try {
    const session = isLoggedIn.get();
    if (session?.$id) {
      await appwriteAccount.deleteSession(session?.$id);
      isLoggedIn.set(undefined);
      window.location.href = "/";
    }
  } catch (error) {
    const appwriteError = error as AppwriteException;
    alert(appwriteError.message);
  }
};

export const register = async (email: string, password: string) => {
  try {
    await appwriteAccount.create(ID.unique(), email, password);
    const session = await appwriteAccount.createEmailSession(email, password);
    isLoggedIn.set(session);
    window.location.href = "/account";
  } catch (error) {
    const appwriteError = error as AppwriteException;
    alert(appwriteError.message);
  }
};

export const account = async () => {
  try {
    return appwriteAccount.get();
  } catch (error) {
    const appwriteError = error as AppwriteException;
    alert(appwriteError.message);
  }
};
