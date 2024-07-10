import React, { useEffect, useState } from "react";
import axios from "axios";

const InverterData: React.FC = ({ apiUrl, command }) => {
  const [data, setData] = useState<any>({});

  const fetchData = async (scommand: string) => {
    try {
      console.log(scommand);
      const response = await axios.get(`${apiUrl}api/${scommand}`);
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(command); // Example command
  }, [command]);

  return (
    <div>
      <h1>Inverter Data</h1>
      <p>Command: {data.command}</p>
      <p>Grid Voltage: {data.gridVoltage}</p>
      <p>Output Voltage: {data.outputVoltage}</p>
      <p>Output Frequency: {data.outputFrequency}</p>
      <p>Battery Voltage: {data.batteryVoltage}</p>
      <p>Output Power: {data.outputPower}</p>
      <p>Output Apparent Power: {data.outputApparentPower}</p>
      <p>Battery Charging Current: {data.batteryChargingCurrent}</p>
      <p>Battery Discharge Current: {data.batteryDischargeCurrent}</p>
      <p>Battery Capacity: {data.batteryCapacity}</p>
      {/* Add other fields as necessary */}
    </div>
  );
};

export default InverterData;
