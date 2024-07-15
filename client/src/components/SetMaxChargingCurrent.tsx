import { useState } from "react";
import { setInverterParameters } from "../services/api";

const SetMaxChargingCurrent = () => {
  const [response, setResponse] = useState<string>("");
  const [amps, setAmps] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const commands = [
    "Select AMPs",
    "002",
    "010",
    "020",
    "030",
    "040",
    "050",
    "060",
    "070",
    "080",
  ];

  const listOptions = commands.map((commands) => (
    <option key={commands} value={commands}>
      {commands}
    </option>
  ));

  const handleCommandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAmps(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await setInverterParameters("MNCHGC", amps);
      setResponse(res[0].response);
      console.log(res[0].response);
    } catch (err) {
      setError("Failed to Restore Default.");
    }
  };

  return (
    <div className="bg-[grey] flex flex-col mt-[50px] w-screen h-auto p-[20px] rounded-md">
      <span style={{ fontSize: "24px" }}>Max Charging Current:</span>
      <form onSubmit={handleSubmit}>
        <select onChange={handleCommandChange} value={amps}>
          {listOptions}
        </select>
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

export default SetMaxChargingCurrent;
