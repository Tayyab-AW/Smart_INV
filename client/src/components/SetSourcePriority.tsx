// src/components/SetMaxChargingCurrent.tsx
import React, { useState } from "react";
import { setSourcePriority } from "../services/api";

const SetSourcePriority: React.FC = () => {
  const [sourcePriorityValue, setSourcePriorityValue] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await setSourcePriority(sourcePriorityValue);
      setResponse(data.response.rawResponse);
    } catch (err) {
      setError("Failed to set max charging current.");
    }
  };

  const handleCommandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSourcePriorityValue(e.target.value);
    console.log(sourcePriorityValue);
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
          <select onChange={handleCommandChange} value={sourcePriorityValue}>
            <option value="00">Utility First</option>
            <option value="01">Solar First</option>
            <option value="02">SBU</option>
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

export default SetSourcePriority;
