// src/components/SetMaxChargingCurrent.tsx
import React, { useState } from "react";
import { setMaxChargingCurrent } from "../services/api";

const SetMaxChargingCurrent: React.FC = () => {
  const [maxChargingCurrent, setMaxChargingCurrentValue] = useState<string>("");
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await setMaxChargingCurrent(maxChargingCurrent);
      setResponse(data.response.rawResponse);
    } catch (err) {
      setError("Failed to set max charging current.");
    }
  };

  const handleCommandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxChargingCurrentValue(e.target.value);
    console.log(maxChargingCurrent);
  };

  return (
    <div>
      <h2>Set Max Charging Current</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Max Charging Current:
          {/* <input
            type="number"
            value={maxChargingCurrent}
            onChange={(e) => setMaxChargingCurrentValue(Number(e.target.value))}
          /> */}
          <select onChange={handleCommandChange} value={maxChargingCurrent}>
            <option value="002">002</option>
            <option value="010">010</option>
            <option value="020">020</option>
            <option value="030">030</option>
            <option value="040">040</option>
            <option value="050">050</option>
            <option value="060">060</option>
            {/* Add other commands as needed */}
          </select>
        </label>
        <button type="submit">Set</button>
      </form>
      {response && (
        <div>
          <h3>Response</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && <div>{error}</div>}
    </div>
  );
};

export default SetMaxChargingCurrent;
