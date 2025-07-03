import { Client, Databases } from "node-appwrite";

import { config } from "dotenv";

config();
const client = new Client();

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_DEV_KEY);

const databases = new Databases(client);
export { databases };
