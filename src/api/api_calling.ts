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

export const getActionTable = async (tableId: string) => {
  try {
    const response = await jamaiApi.get(`/gen_tables/action/${tableId}`);
    return response.data;
  } catch (error) {
    console.error("Error in getting action table:", error);
    throw error;
  }
};

export const getActionTableRows = async (tableId: string) => {
  try {
    const response = await jamaiApi.get(`/gen_tables/action/${tableId}/rows`);
    return response.data.items;
  } catch (error) {
    console.error("Error in getting action table:", error);
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

// TODO: Not familiar with the API, Error Code: 500
export const updateRow = async (tableId: string, rowId: string, data: any) => {
  console.log("row id: ", rowId);
  console.log("data in updating row: ", data);
  try {
    const response = await jamaiApi.post("/gen_tables/action/rows/update", {
      table_id: tableId,
      row_id: rowId,
      data: {
        content: "Simple test content",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in updateRow:", error);
    throw error;
  }
};

// TODO: Not familiar with the API, Error Code: 500
export const deleteRow = async (tableId: string, rowId: string) => {
  try {
    const response = await jamaiApi.delete(
      `/gen_tables/action/${tableId}/rows/${rowId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateRow:", error);
    throw error;
  }
};
