import { useState } from "react";
import { setInverterParameters } from "../services/api";

const SetBatteryEqualizationToEnableOrDisable = () => {
  const [response, setResponse] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const commands = ["Select Type", "AGM", "Flooded"];

  const listOptions = commands.map((commands) => (
    <option key={commands} value={commands}>
      {commands}
    </option>
  ));

  const handleCommandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const frequencyValue =
      e.target.value === "AGM"
        ? "00"
        : e.target.value === "Flooded"
        ? "01"
        : "";
    setSource(frequencyValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await setInverterParameters("PBT", source);
      setResponse(res[0].response);
      console.log(res[0].response);
    } catch (err) {
      setError("Failed to change value.");
    }
  };

  return (
    <div className="bg-[grey] flex flex-col mt-[50px] w-screen h-auto p-[20px] rounded-md">
      <span style={{ fontSize: "24px" }}>Set Battery Type:</span>
      <form onSubmit={handleSubmit}>
        <select onChange={handleCommandChange} value={source}>
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

export default SetBatteryEqualizationToEnableOrDisable;
