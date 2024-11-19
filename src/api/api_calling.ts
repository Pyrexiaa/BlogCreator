// src/utils/api.ts
import axios from "axios";

const API_BASE_URL = "https://api.jamaibase.com/api/v1";

const jamaiApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
});

export const setJamaiApiKey = (apiKey: string, projectId: string) => {
  jamaiApi.defaults.headers.common["Authorization"] = `Bearer ${apiKey}`;
  jamaiApi.defaults.headers.common["X-PROJECT-ID"] = projectId;
};
// jamaiApi.defaults.headers.common["Authorization"] = `Bearer ${apiKey}`;
// jamaiApi.defaults.headers.common["X-PROJECT-ID"] = projectId;

// Refer https://jamaibase.readme.io/reference/create_action_table_api_v1_gen_tables_action_post
export const createActionTable = async (tableId: string, schema: any[]) => {
  try {
    const response = await jamaiApi.post("/gen_tables/action", {
      id: tableId,
      cols: schema,
    });
    return response.data;
  } catch (error) {
    console.error("Error in addRow:", error);
    throw error;
  }
};

export const addRow = async (tableId: string, data: any[]) => {
  try {
    const response = await jamaiApi.post("/gen_tables/action/rows/add", {
      table_id: tableId,
      data: data,
      stream: false,
    });
    return response.data;
  } catch (error) {
    console.error("Error in addRow:", error);
    throw error;
  }
};
