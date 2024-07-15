// src/components/InverterData.tsx
import React, { useState } from "react";
import { queryInverterParameters } from "../services/api";

const InverterData: React.FC = () => {
  const [response, setResponse] = useState<any>("");
  const [error, setError] = useState<string | null>(null);
  const [command, setCommand] = useState<string>("");

  const handleCommandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCommand(e.target.value);
  };

  const commands = [
    "Select Command",
    "QID",
    "QSID",
    "QVFW",
    "QVFW2",
    "QPIRI",
    "QFLAG",
    "QPIGS",
    "QPGSn",
    "QMOD",
    "QPIWS",
    "QDI",
    "QMCHGCR",
    "QMUCHGCR",
    "QOPM",
    "QMN",
    "QGMN",
    "QBEQI",
  ];

  const listOptions = commands.map((commands) => (
    <option key={commands} value={commands}>
      {commands}
    </option>
  ));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await queryInverterParameters(command);
      setResponse(res);
      console.log(res);
    } catch (err) {
      setError("Failed to Restore Default.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-[grey] flex flex-col mt-[50px] w-screen h-auto p-[20px] rounded-md">
      <form onSubmit={handleSubmit}>
        <select onChange={handleCommandChange} value={command}>
          {listOptions}
        </select>
        <button type="submit">Query</button>
      </form>
      {response && <h2>Inverter Data for {command}</h2>}
      <div>
        {response.length > 0 &&
          Object.keys(response[0]).map((key) => (
            <div key={key} className="flex mb-[10px] gap-6">
              <strong className="block box-border h-auto w-[300px] break-words">
                {key}:
              </strong>
              <span>{response[0][key]}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default InverterData;
