// src/App.tsx
import React, { useState } from "react";
import InverterData from "./components/InverterData";
import SetMaxChargingCurrent from "./components/SetMaxChargingCurrent";
import SetSourcePriority from "./components/SetSourcePriority";
import SetToDefault from "./components/SetToDefault";

const App: React.FC = () => {
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

  return (
    <div>
      <div>
        <h1>Smart Inverter Control Panel</h1>
        <select onChange={handleCommandChange} value={command}>
          {listOptions}
          {/* <option value="">Select Command</option>
          <option value="QPIRI">QPIRI</option>
          <option value="QID">QID</option>
          <option value="QVFW">QVFW</option>
          <option value="QVFW2">QVFW2</option>
          <option value="QPIGS">QPIGS</option>
          <option value="QMOD">QMOD</option>
          <option value="QPIWS">QPIWS</option>
          <option value="QFLAG">QFLAG</option>
          <option value="QDI">QDI</option>
          <option value="QBEQI">QBEQI</option> */}
          {/* Add other commands as needed */}
        </select>
        {command && <InverterData command={command} />}
      </div>
      <div>
        <SetMaxChargingCurrent />
      </div>
      <div>
        <SetSourcePriority />
      </div>
      <div>
        <SetToDefault />
      </div>
    </div>
  );
};

export default App;
