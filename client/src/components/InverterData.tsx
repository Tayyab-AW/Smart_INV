// src/components/InverterData.tsx
import React, { useEffect, useState } from "react";
import { fetchInverterData } from "../services/api";

interface InverterDataProps {
  command: string;
}

const InverterData: React.FC<InverterDataProps> = ({ command }) => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchInverterData(command);
        setData(response);
      } catch (err) {
        setError("Failed to fetch data from the inverter.");
      }
    };

    getData();
  }, [command]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Inverter Data for {command}</h2>
      <div>
        {data.length > 0 &&
          Object.keys(data[0]).map((key) => (
            <div key={key} style={{ display: "flex", marginBottom: "10px" }}>
              <strong style={{ width: "300px" }}>{key}:</strong>
              <span>{data[0][key]}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default InverterData;
