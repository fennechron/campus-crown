import { Client, TablesDB } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error(
    "Missing Appwrite environment variables. Add VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID to your .env file."
  );
}

const client = new Client();

client.setEndpoint(endpoint);
client.setProject(projectId);

const db = new TablesDB(client);

export { client, db };
