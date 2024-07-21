// src/DeviceStatus.js
import React, { useEffect, useState } from "react";
import { getAllDevices } from "../services/api";

const DeviceStatus = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await getAllDevices();
        console.log(response);
        setDevices(response);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();

    const interval = setInterval(fetchDevices, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Device Status</h1>
      <ul>
        {devices.map((device) => (
          <li key={device.serialNumber}>
            {device.serialNumber} - {device.online ? "Online" : "Offline"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceStatus;
