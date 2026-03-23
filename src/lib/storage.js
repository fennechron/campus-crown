// localStorage helpers for vote persistence
const STORAGE_KEY = "college_awards_votes";
const SESSION_KEY = "college_awards_submitted";
const VISITOR_ID_KEY = "college_awards_visitor_id";

export function saveVotesLocally(votes) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    } catch { }
}

export function loadVotesLocally() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function clearVotesLocally() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { }
}

export function markSubmitted() {
    try {
        localStorage.setItem(SESSION_KEY, "true");
        markSubmittedIDB();
    } catch { }
}

export function hasSubmitted() {
    try { return localStorage.getItem(SESSION_KEY) === "true"; } catch { return false; }
}

export function saveVisitorId(visitorId) {
    try {
        localStorage.setItem(VISITOR_ID_KEY, visitorId);
        saveVisitorIdIDB(visitorId);
    } catch { }
}

export function getVisitorId() {
    try { return localStorage.getItem(VISITOR_ID_KEY); } catch { return null; }
}

// ─── IndexedDB Helpers (Secondary persistence) ─────────────────────────────
const DB_NAME = "AwardsDB";
const STORE_NAME = "AwardState";

function getDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.error);
    });
}

export async function markSubmittedIDB() {
    try {
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put("true", SESSION_KEY);
    } catch { }
}

export async function hasSubmittedIDB() {
    try {
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, "readonly");
        return new Promise((resolve) => {
            const req = tx.objectStore(STORE_NAME).get(SESSION_KEY);
            req.onsuccess = () => resolve(req.result === "true");
            req.onerror = () => resolve(false);
        });
    } catch { return false; }
}

export async function saveVisitorIdIDB(vid) {
    try {
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(vid, VISITOR_ID_KEY);
    } catch { }
}

export async function getVisitorIdIDB() {
    try {
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, "readonly");
        return new Promise((resolve) => {
            const req = tx.objectStore(STORE_NAME).get(VISITOR_ID_KEY);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    } catch { return null; }
}
