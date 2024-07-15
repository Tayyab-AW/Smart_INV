import { useState } from "react";
import { setInverterParameters } from "../services/api";

const SetOuputSourcePriority = () => {
  const [response, setResponse] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const commands = [
    "Select Ouput Source",
    "Utility First",
    "Solar First",
    "SBU",
  ];

  const listOptions = commands.map((commands) => (
    <option key={commands} value={commands}>
      {commands}
    </option>
  ));

  const handleCommandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const frequencyValue =
      e.target.value === "Utility First"
        ? "00"
        : e.target.value === "Solar First"
        ? "01"
        : e.target.value === "SBU"
        ? "02"
        : "";
    setSource(frequencyValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await setInverterParameters("POP", source);
      setResponse(res[0].response);
      console.log(res[0].response);
    } catch (err) {
      setError("Failed to Restore Default.");
    }
  };

  return (
    <div className="bg-[grey] flex flex-col mt-[50px] w-screen h-auto p-[20px] rounded-md">
      <span style={{ fontSize: "24px" }}>Set Output Source Priority:</span>
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

export default SetOuputSourcePriority;
