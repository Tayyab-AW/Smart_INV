import { useState } from "react";
import { setInverterParameters } from "../services/api";

const SetOuputFrequency = () => {
  const [response, setResponse] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const commands = ["Select Frequency", "50Hz", "60Hz"];

  const listOptions = commands.map((commands) => (
    <option key={commands} value={commands}>
      {commands}
    </option>
  ));

  const handleCommandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const frequencyValue = e.target.value.replace(/[^0-9 .]/g, "");
    setFrequency(frequencyValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await setInverterParameters("F", frequency);
      setResponse(res[0].response);
      console.log(res[0].response);
    } catch (err) {
      setError("Failed to Restore Default.");
    }
  };

  return (
    <div className="bg-[grey] flex flex-col mt-[50px] w-screen h-auto p-[20px] rounded-md">
      <span style={{ fontSize: "24px" }}>Set Frequency:</span>
      <form onSubmit={handleSubmit}>
        <select onChange={handleCommandChange} value={frequency}>
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

export default SetOuputFrequency;
