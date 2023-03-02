import { Account, AppwriteException, Client, Databases, Storage, ID, Models } from 'appwrite';
import { atom, WritableAtom } from 'nanostores';

/** Setup */
export const appwriteClient = new Client()
    .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT) // Your API Endpoint
    .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID); // Your project ID

/** Database */
export interface BlogPost extends Models.Document {
    title: string;
    date: string;
    description: string;
    content: string;
    slug: string;
    cover: string;
}
export interface BlogPostList extends Models.DocumentList<BlogPost> { }

export interface BlogComment extends Models.Document {
    postId: string;
    comment: string;
}
export interface BlogCommentList extends Models.DocumentList<BlogComment> { }

export const appwriteDatabases = new Databases(appwriteClient);

/** Account */
export const appwriteAccount = new Account(appwriteClient);
export const isLoggedIn: WritableAtom<undefined | Models.Session> = atom(undefined);

// Check for session
appwriteAccount.getSession('current').then(function (response) {
    isLoggedIn.set(response);
}, function (error) {
    isLoggedIn.set(undefined)
})

export const user$: WritableAtom<undefined | Models.Account<Models.Preferences>> = atom(undefined);

isLoggedIn.subscribe(async (session) => {
    if (session?.userId) {
        user$.set(await account());
    }
});

export const login = async (email: string, password: string) => {
    try {
        const session = await appwriteAccount.createEmailSession(email, password);
        isLoggedIn.set(session);
        window.location.href = '/account';
    } catch (error) {
        const appwriteError = error as AppwriteException;
        alert(appwriteError.message)
    }
}

export const logout = async () => {
    try {
        const session = isLoggedIn.get();
        console.log(session)
        if (session?.$id) {
            await appwriteAccount.deleteSession(session?.$id);
            isLoggedIn.set(undefined);
            window.location.href = '/';
        }
    } catch (error) {
        const appwriteError = error as AppwriteException;
        alert(appwriteError.message)
    }
}

export const register = async (email: string, password: string) => {
    try {
        await appwriteAccount.create(ID.unique(), email, password);
        const session = await appwriteAccount.createEmailSession(email, password);
        isLoggedIn.set(session);
        window.location.href = '/account';
    } catch (error) {
        const appwriteError = error as AppwriteException;
        alert(appwriteError.message)
    }
}

export const account = async () => {
    try {
        return appwriteAccount.get();
    } catch (error) {
        const appwriteError = error as AppwriteException;
        alert(appwriteError.message)
    }
}

export const storage = () => {
    const storage = new Storage(appwriteClient);
    return storage
}
