import { Client, Databases } from 'appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const DB_ID = process.env.VITE_APPWRITE_DB_ID;
const VOTES_COL = process.env.VITE_APPWRITE_VOTES_COLLECTION_ID;
const SETTINGS_COL = process.env.VITE_APPWRITE_SETTINGS_COLLECTION_ID;
const NOMINEES_COL = process.env.VITE_APPWRITE_NOMINEES_COLLECTION_ID;
const CAT_COL = process.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID;

async function checkAppwrite() {
    console.log("--- APPWRITE DIAGNOSTICS ---");
    console.log(`Endpoint: ${process.env.VITE_APPWRITE_ENDPOINT}`);
    console.log(`Project:  ${process.env.VITE_APPWRITE_PROJECT_ID}`);
    console.log(`DB ID:    ${DB_ID}`);

    try {
        console.log("\n1. Checking Settings Collection...");
        const settings = await databases.listDocuments(DB_ID, SETTINGS_COL);
        console.log(`✅ Found ${settings.total} documents.`);
    } catch (err) {
        console.error(`❌ Error reading Settings (${SETTINGS_COL}):`, err.message);
    }

    try {
        console.log("\n2. Checking Nominees Collection...");
        const nominees = await databases.listDocuments(DB_ID, NOMINEES_COL, [], 5);
        console.log(`✅ Found ${nominees.total} total nominees.`);
        if (nominees.documents.length > 0) {
            console.log("   Latest 5 nominees:");
            nominees.documents.forEach(doc => {
                console.log(`   - [${doc.$id}] Name: ${doc.name}`);
            });
        }
    } catch (err) {
        console.error(`❌ Error reading Nominees (${NOMINEES_COL}):`, err.message);
    }

    try {
        console.log("\n3. Checking Votes Collection...");
        const votes = await databases.listDocuments(DB_ID, VOTES_COL, [], 5);
        console.log(`✅ Found ${votes.total} total votes.`);
    } catch (err) {
        console.error(`❌ Error reading Votes (${VOTES_COL}):`, err.message);
        if (err.message.includes("Collection not found")) {
            console.log("   💡 Tip: Make sure you have created the collection in Appwrite Console.");
        }
    }

    try {
        console.log("\n4. Checking Categories Collection...");
        const categories = await databases.listDocuments(DB_ID, CAT_COL, [], 5);
        console.log(`✅ Found ${categories.total} total categories.`);
        if (categories.documents.length > 0) {
            console.log("   Latest 5 categories:");
            categories.documents.forEach(doc => {
                console.log(`   - [${doc.$id}] Name: ${doc.name}`);
            });
        }
    } catch (err) {
        console.error(`❌ Error reading Categories (${CAT_COL}):`, err.message);
    }
}

checkAppwrite();
