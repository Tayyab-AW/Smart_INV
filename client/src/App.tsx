// src/App.tsx
import React, { useState } from "react";
import InverterData from "./components/InverterData";
import SetToDefault from "./components/SetToDefault";
import SetMaxChargingCurrent from "./components/SetMaxChargingCurrent";
import SetMaxUtilityChargingCurrent from "./components/SetMaxUtilityChargingCurrent";

const App: React.FC = () => {
  return (
    <div style={{margin: "20px", display: 'flex', flexDirection: "column",  }}>
      <div>
        <InverterData />
      </div>
      <div>
        <SetMaxChargingCurrent />
      </div>
      <div>
        <SetMaxUtilityChargingCurrent />
      </div>
      <div>{/* <SetSourcePriority /> */}</div>
      <div>
        <SetToDefault />
      </div>
    </div>
  );
};

export default App;
