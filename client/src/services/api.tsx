// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, // Change this to your Node.js server URL
});

export const toggleLED = async (action: "on" | "off") => {
  const endpoint = action === "on" ? "api/led-on" : "api/led-off";
  const response = await api.post(`${endpoint}`);
  return response.data;
};

//Query Parameters Endpoint

export const queryInverterParameters = async (command: string) => {
  const response = await api.get(`api/inverter/${command}`);
  return response.data;
};

//Setting Parameters Endpoint

export const setInverterParameters = async (command: string, data: string) => {
  const response = await api.post(`api/inverter/${command}`, {
    data,
  });
  return response.data;
};
