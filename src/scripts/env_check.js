import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log("--- ENV CHECK ---");
console.log(`Endpoint: ${process.env.VITE_APPWRITE_ENDPOINT}`);
console.log(`Project:  ${process.env.VITE_APPWRITE_PROJECT_ID}`);
console.log(`DB ID:    ${process.env.VITE_APPWRITE_DB_ID}`);
console.log("-----------------");

if (!process.env.VITE_APPWRITE_ENDPOINT) {
    console.error("❌ ERROR: VITE_APPWRITE_ENDPOINT is not defined in .env");
} else {
    console.log("✅ .env loaded correctly.");
}
