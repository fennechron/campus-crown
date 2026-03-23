import { db } from "../lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { GLOBAL_NOMINEES } from "./categories";

/**
 * Run this function in a development environment or via a temporary admin page
 * to populate your Firestore with the initial nominees and default settings.
 */
export async function initializeFirestoreData() {
    try {
        console.log("Starting Firestore initialization...");

        // 1. Initialize Nominees
        const nomineesColl = collection(db, "nominees");
        for (const nominee of GLOBAL_NOMINEES) {
            const nomineeRef = doc(nomineesColl, nominee.id);
            await setDoc(nomineeRef, {
                name: nominee.name,
                gender: nominee.gender,
                tagline: nominee.tagline,
                $createdAt: serverTimestamp(),
                $updatedAt: serverTimestamp(),
                $permissions: null
            });
            console.log(`Added nominee: ${nominee.name}`);
        }

        // 2. Initialize Settings
        const settingsRef = doc(db, "settings", "general");
        await setDoc(settingsRef, {
            resultPublishDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            $createdAt: serverTimestamp(),
            $updatedAt: serverTimestamp()
        });
        console.log("Added default settings.");

        console.log("Firestore initialization complete! ✅");
    } catch (err) {
        console.error("Firestore initialization failed: ❌", err);
    }
}
