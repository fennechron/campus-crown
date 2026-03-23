import { db } from "./firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    limit,
    serverTimestamp,
    getCountFromServer
} from "firebase/firestore";

const COLLECTIONS = {
    categories: "categories",
    nominees: "nominees",
    votes: "votes",
    settings: "settings",
};

// ─── Auth (Mocked for Fingerprint ID mapping) ───────────────────────────────

export async function getOrCreateSession() {
    // Firestore doesn't require explicit session creation for public access 
    // (depending on rules), but we return a mock to keep compatibility.
    return { $id: "anonymous" };
}

export async function getCurrentUserId() {
    // This project uses fingerprint visitorId as userId, managed in the UI components
    return null;
}

// ─── Votes ──────────────────────────────────────────────────────────────────

export async function castVote(userId, categoryId, nomineeId) {
    try {
        const docRef = doc(db, COLLECTIONS.votes, userId);
        await setDoc(docRef, {
            userId,
            [categoryId]: nomineeId,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (err) {
        console.error("castVote error:", err);
        throw err;
    }
}

export async function getUserVotes(userId) {
    if (!userId) return {};
    try {
        const docRef = doc(db, COLLECTIONS.votes, userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // eslint-disable-next-line no-unused-vars
            const { userId: uid, updatedAt, ...votes } = data;
            return votes;
        }
        return {};
    } catch (err) {
        console.error("getUserVotes error:", err);
        return {};
    }
}

export async function submitAllVotes(userId, votes) {
    const shouldCheck = import.meta.env.VITE_CHECK_PREVIOUS_VOTES === "true";
    try {
        const docRef = doc(db, COLLECTIONS.votes, userId);
        if (shouldCheck) {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                throw new Error("Already voted");
            }
        }
        await setDoc(docRef, {
            userId,
            ...votes,
            updatedAt: serverTimestamp()
        }, { merge: !shouldCheck });
    } catch (err) {
        console.error("submitAllVotes error:", err);
        throw err;
    }
}

// ─── Results ────────────────────────────────────────────────────────────────

export async function getVoteCount() {
    try {
        const coll = collection(db, COLLECTIONS.votes);
        const snapshot = await getCountFromServer(coll);
        return snapshot.data().count;
    } catch (err) {
        console.error("getVoteCount error:", err);
        return 0;
    }
}

export async function getResults() {
    try {
        const q = query(collection(db, COLLECTIONS.votes));
        const querySnapshot = await getDocs(q);

        // Aggregate: { categoryId: { nomineeId: count } }
        const agg = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // eslint-disable-next-line no-unused-vars
            const { userId: _, updatedAt, ...votes } = data;

            Object.entries(votes).forEach(([catId, nomineeId]) => {
                if (!agg[catId]) agg[catId] = {};
                agg[catId][nomineeId] = (agg[catId][nomineeId] || 0) + 1;
            });
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
        const q = query(collection(db, COLLECTIONS.settings), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data().resultPublishDate;
        }
        return null;
    } catch (err) {
        console.error("getResultPublishDate error:", err);
        return null;
    }
}

export async function saveResultPublishDate(publishDate) {
    try {
        const q = query(collection(db, COLLECTIONS.settings), limit(1));
        const querySnapshot = await getDocs(q);
        const dateStr = new Date(publishDate).toISOString();
        if (!querySnapshot.empty) {
            const docRef = doc(db, COLLECTIONS.settings, querySnapshot.docs[0].id);
            await updateDoc(docRef, { resultPublishDate: dateStr });
        } else {
            const docRef = doc(collection(db, COLLECTIONS.settings));
            await setDoc(docRef, { resultPublishDate: dateStr });
        }
    } catch (err) {
        console.error("saveResultPublishDate error:", err);
        throw err;
    }
}

export async function getNominees() {
    try {
        const q = query(collection(db, COLLECTIONS.nominees));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            $id: doc.id,
            ...doc.data()
        }));
    } catch (err) {
        console.error("getNominees error:", err);
        return [];
    }
}

export { db, COLLECTIONS };
