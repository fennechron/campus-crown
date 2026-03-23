import { Client, Databases, Account, ID, Query } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;

const COLLECTIONS = {
  categories: import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID || "categories",
  nominees: import.meta.env.VITE_APPWRITE_NOMINEES_COLLECTION_ID || "nominees",
  votes: import.meta.env.VITE_APPWRITE_VOTES_COLLECTION_ID || "votes",
  settings: import.meta.env.VITE_APPWRITE_SETTINGS_COLLECTION_ID || "settings",
};

const client = new Client();
client.setEndpoint(endpoint);
client.setProject(projectId);

const databases = new Databases(client);
const account = new Account(client);

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function getOrCreateSession() {
  try {
    const user = await account.get();
    return user;
  } catch {
    try {
      const session = await account.createAnonymousSession();
      return session;
    } catch (err) {
      console.error("Session error:", err);
      return null;
    }
  }
}

export async function getCurrentUserId() {
  try {
    const user = await account.get();
    return user.$id;
  } catch {
    return null;
  }
}

// ─── Votes ──────────────────────────────────────────────────────────────────

export async function castVote(userId, categoryId, nomineeId) {
  try {
    // Check for existing vote
    const existing = await databases.listDocuments(databaseId, COLLECTIONS.votes, [
      Query.equal("userId", userId),
      Query.equal("categoryId", categoryId),
    ]);

    if (existing.total > 0) {
      // Update existing vote
      return await databases.updateDocument(
        databaseId,
        COLLECTIONS.votes,
        existing.documents[0].$id,
        { nomineeId }
      );
    }

    // Create new vote
    return await databases.createDocument(
      databaseId,
      COLLECTIONS.votes,
      ID.unique(),
      { userId, categoryId, nomineeId }
    );
  } catch (err) {
    console.error("castVote error:", err);
    throw err;
  }
}

export async function getUserVotes(userId) {
  try {
    const res = await databases.listDocuments(databaseId, COLLECTIONS.votes, [
      Query.equal("userId", userId),
      Query.limit(100),
    ]);
    // Return map: categoryId -> nomineeId
    const map = {};
    res.documents.forEach((doc) => {
      map[doc.categoryId] = doc.nomineeId;
    });
    return map;
  } catch (err) {
    console.error("getUserVotes error:", err);
    return {};
  }
}

export async function submitAllVotes(userId, votes) {
  // votes: { categoryId: nomineeId, ... }
  const promises = Object.entries(votes).map(([categoryId, nomineeId]) =>
    castVote(userId, categoryId, nomineeId)
  );
  return Promise.allSettled(promises);
}

// ─── Results ────────────────────────────────────────────────────────────────

export async function getResults() {
  try {
    const res = await databases.listDocuments(databaseId, COLLECTIONS.votes, [
      Query.limit(5000),
    ]);

    // Aggregate: { categoryId: { nomineeId: count } }
    const agg = {};
    res.documents.forEach(({ categoryId, nomineeId }) => {
      if (!agg[categoryId]) agg[categoryId] = {};
      agg[categoryId][nomineeId] = (agg[categoryId][nomineeId] || 0) + 1;
    });
    return agg;
  } catch (err) {
    console.error("getResults error:", err);
    return {};
  }
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getResultPublishDate() {
  try {
    const res = await databases.listDocuments(databaseId, COLLECTIONS.test, [
      Query.limit(1),
    ]);
    if (res.documents.length > 0) {
      return res.documents[0].resultPublishDate;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getNominees() {
  try {
    const res = await databases.listDocuments(databaseId, COLLECTIONS.nominees, [
      Query.limit(100),
    ]);
    return res.documents;
  } catch (err) {
    console.error("getNominees error:", err);
    return [];
  }
}

export { client, databases, account, databaseId, COLLECTIONS };
