// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://api-smartinv.tayyabaw.com/", // Change this to your Node.js server URL
  //   withCredentials: true,
});

export const fetchInverterData = async (command: string) => {
  const response = await api.get(`api/${command}`);
  return response.data;
};

export const toggleLED = async (action: "on" | "off") => {
  const endpoint = action === "on" ? "api/led-on" : "api/led-off";
  const response = await api.post(`${endpoint}`);
  return response.data;
};

export const setMaxChargingCurrent = async (maxChargingCurrent: string) => {
  const response = await api.post("/api/inverter/mchgc", {
    maxChargingCurrent,
  });
  return response.data;
};

export const setSourcePriority = async (sourcePriority: string) => {
  const response = await api.post("/api/inverter/pop", {
    sourcePriority,
  });
  return response.data;
};

export const setToDefault = async (command: string) => {
  const response = await api.post("/api/inverter/pf", {
    command,
  });
  return response.data;
};
