import { useState } from "react";
import { setInverterParameters } from "../services/api";

const SetBatteryEqualizationTime = () => {
  const [response, setResponse] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleCommandChange = (e: any) => {
    setSource(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await setInverterParameters("PBEQT", source);
      setResponse(res[0].response);
      console.log(res[0].response);
    } catch (err) {
      setError("Failed to change value.");
    }
  };

  return (
    <div className="bg-[grey] flex flex-col mt-[50px] w-screen h-auto p-[20px] rounded-md">
      <span style={{ fontSize: "24px" }}>Set Equalization Time:</span>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Input Time from 5 to 900 Min"
          value={source}
          onChange={handleCommandChange}
        />
        <button type="submit">Set</button>
      </form>

      {response && (
        <div>
          <h3>Response</h3>
          <pre>{JSON.stringify(response)}</pre>
        </div>
      )}
      {error && <div>{error}</div>}
    </div>
  );
};

export default SetBatteryEqualizationTime;
