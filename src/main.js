import express from "express";
import dotenv from "dotenv";
import { databases } from "./api/appWriteClient.js";
import { updateRecord } from "./api/zoho.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT;

const DATABASE_ID = "sjpl_zoho";
const COLLECTION_ID = "68653d1600092148a33c";

const zohoAppwriteSync = async () => {
  try {
    const promise = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    const sync_data = promise.documents.map(async (data) => {
      try {
        const payload = {
          data: {
            Response_Value: data.response,
            remarks: data.remarks,
            flag_choice: data.flag_choice,
          },
        };
        const response = await updateRecord(
          "All_Maintenance_Scheduler_Task_List",
          data.scheduler_task_id,
          payload
        );
        console.log("Updated data", response);
        try {
          const delete_promise = await databases.deleteDocument(
            DATABASE_ID,
            COLLECTION_ID,
            data.$id
          );
          console.log("Appwrite data successfully deleted", delete_promise);
        } catch (error) {
          console.log("Error deleting document", error);
        }
      } catch (error) {
        console.log("Error adding data in zoho", error);
      }
    });
  } catch (error) {
    console.log("Error getting appwrite data", error);
  }
};
zohoAppwriteSync();
app.listen(PORT, () => {
  console.log("Server is running on PORT", PORT);
});
