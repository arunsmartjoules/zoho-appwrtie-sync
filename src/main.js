import express from "express";
import { config } from "dotenv";
import { databases } from "./api/appWriteClient.js";
import { updateRecord } from "./api/zoho.js";

const app = express();
app.use(express.json());
config();

const DATABASE_ID = "sjpl_zoho";
const COLLECTION_ID = "68653d1600092148a33c";

const zohoAppwriteSync = async () => {
  try {
    const promise = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    console.log(promise);

    for (const data of promise.documents) {
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
        console.log("Updated data", JSON.stringify(response));
        if (response.code === 3000) {
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
        } else {
          console.log("Cannot update data in zoho");
        }
      } catch (error) {
        console.log("Error adding data in zoho", error);
      }
    }
  } catch (error) {
    console.log("Error getting appwrite data", error);
  }
};
export default async () => {
  try {
    await zohoAppwriteSync();
    return {
      statusCode: 200,
      body: JSON.stringify({ execution: "success" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ execution: "failed", error: error.message }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
