// src/DeviceStatus.js
import { useEffect, useState } from "react";
import { getAllDevices } from "../services/api";

// Define a type for the device
interface Device {
  serialNumber: string;
  online: boolean;
}

const DeviceStatus = () => {
  const [devices, setDevices] = useState<Device[]>([]);

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
