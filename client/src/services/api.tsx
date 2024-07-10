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

// export const setStatusFlag = async (data: string) => {
//   const response = await api.post("/api/inverter/PE", {
//     data,
//   });
//   return response.data;
// };

// export const setToDefault = async (data: string) => {
//   const response = await api.post("/api/inverter/PF", {
//     data,
//   });
//   return response.data;
// };

// // export const setMaxChargingCurrent = async (data: string) => {
// //   const response = await api.post("/api/inverter/MCHGC", {
// //     data,
// //   });
// //   return response.data;
// // };

// export const setMaxChargingCurrent = async (data: string) => {
//   const response = await api.post("/api/inverter/MNCHGC", {
//     data,
//   });
//   return response.data;
// };

// export const setMaxUtilityChargingCurrent = async (data: string) => {
//   const response = await api.post("/api/inverter/MUCHGC", {
//     data,
//   });
//   return response.data;
// };

// export const setOuputFrequency = async (data: string) => {
//   const response = await api.post("/api/inverter/F", {
//     data,
//   });
//   return response.data;
// };

// export const setOuputSourcePriority = async (data: string) => {
//   const response = await api.post("/api/inverter/POP", {
//     data,
//   });
//   return response.data;
// };

// export const setBatteryReChargeVoltage = async (data: string) => {
//   const response = await api.post("/api/inverter/PBCV", {
//     data,
//   });
//   return response.data;
// };

// export const setBatteryReDisChargeVoltage = async (data: string) => {
//   const response = await api.post("/api/inverter/PBDV", {
//     data,
//   });
//   return response.data;
// };

// export const setInverterChargerPriority = async (data: string) => {
//   const response = await api.post("/api/inverter/PCP", {
//     data,
//   });
//   return response.data;
// };

// export const setInverterGridWorkingRange = async (data: string) => {
//   const response = await api.post("/api/inverter/PGR", {
//     data,
//   });
//   return response.data;
// };

// export const setBatteryType = async (data: string) => {
//   const response = await api.post("/api/inverter/PBT", {
//     data,
//   });
//   return response.data;
// };

// export const setBatteryCutOffVoltage = async (data: string) => {
//   const response = await api.post("/api/inverter/PSDV", {
//     data,
//   });
//   return response.data;
// };

// export const setBatteryConstantVoltageChargingVoltage = async (
//   data: string
// ) => {
//   const response = await api.post("/api/inverter/PCVV", {
//     data,
//   });
//   return response.data;
// };

// export const setBatteryFloatChargingVoltage = async (data: string) => {
//   const response = await api.post("/api/inverter/PBFT", {
//     data,
//   });
//   return response.data;
// };

// export const setPvOkCondition = async (data: string) => {
//   const response = await api.post("/api/inverter/PPVOKC", {
//     data,
//   });
//   return response.data;
// };

// export const setSolarPowerBalance = async (data: string) => {
//   const response = await api.post("/api/inverter/PSPB", {
//     data,
//   });
//   return response.data;
// };

// export const setBatteryEqualizationToEnableOrDisable = async (data: string) => {
//   const response = await api.post("/api/inverter/PBEQE", {
//     data,
//   });
//   return response.data;
// };

// export const setBatteryEqualizationTime = async (data: string) => {
//   const response = await api.post("/api/inverter/PBEQT", {
//     data,
//   });
//   return response.data;
// };

// export const setBatteryEqualizationTimePeriod = async (data: string) => {
//   const response = await api.post("/api/inverter/PBEQP", {
//     data,
//   });
//   return response.data;
// };

// export const setBatteryEqualizationVoltage = async (data: string) => {
//   const response = await api.post("/api/inverter/PBEQV", {
//     data,
//   });
//   return response.data;
// };

// export const setBatteryEqualizationOverTime = async (data: string) => {
//   const response = await api.post("/api/inverter/PBEQOT", {
//     data,
//   });
//   return response.data;
// };

// export const setBatteryEqualizationToActiveOrInAcitve = async (
//   data: string
// ) => {
//   const response = await api.post("/api/inverter/PBEQA", {
//     data,
//   });
//   return response.data;
// };

// export const setMaxChargingTimeAtConstantVoltageStage = async (
//   data: string
// ) => {
//   const response = await api.post("/api/inverter/PCVT", {
//     data,
//   });
//   return response.data;
// };

// // For Inverters that support parallel inverters
// export const setOutputMode = async (data: string) => {
//   const response = await api.post("/api/inverter/POPM", {
//     data,
//   });
//   return response.data;
// };

// // For Inverters that support parallel inverters
// export const setParallelInverterChargerPriority = async (data: string) => {
//   const response = await api.post("/api/inverter/PPCP", {
//     data,
//   });
//   return response.data;
// };
