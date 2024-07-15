// src/App.tsx
import React from "react";
import InverterData from "./components/InverterData";
import SetToDefault from "./components/SetToDefault";
import SetMaxChargingCurrent from "./components/SetMaxChargingCurrent";
import SetMaxUtilityChargingCurrent from "./components/SetMaxUtilityChargingCurrent";
import SetStatusFlag from "./components/SetStatusFlag";
import SetOuputFrequency from "./components/SetOuputFrequency";
import SetOuputSourcePriority from "./components/SetOuputSourcePriority";
import SetBatteryReChargeVoltage from "./components/SetBatteryReChargeVoltage";
import SetBatteryReDisChargeVoltage from "./components/SetBatteryReDisChargeVoltage";
import SetInverterChargerPriority from "./components/SetInverterChargerPriority";
import SetInverterGridWorkingRange from "./components/SetInverterGridWorkingRange";
import SetBatteryType from "./components/SetBatteryType";
import SetBatteryCutOffVoltage from "./components/SetBatteryCutOffVoltage";
import SetBatteryFloatChargingVoltage from "./components/SetBatteryFloatChargingVoltage";

const App: React.FC = () => {
  return (
    <div className="block box-border m-0">
      <div>
        <InverterData />
      </div>
      <div>
        <SetMaxChargingCurrent />
      </div>
      <div>
        <SetMaxUtilityChargingCurrent />
      </div>
      <div>
        <SetToDefault />
      </div>
      <div>
        <SetOuputFrequency />
      </div>
      <div>
        <SetOuputSourcePriority />
      </div>
      <div>
        <SetBatteryReChargeVoltage />
      </div>
      <div>
        <SetBatteryReDisChargeVoltage />
      </div>
      <div>
        <SetInverterChargerPriority />
      </div>
      <div>
        <SetInverterGridWorkingRange />
      </div>
      <div>
        <SetBatteryType />
      </div>
      <div>
        <SetBatteryCutOffVoltage />
      </div>
      <div>
        <SetBatteryFloatChargingVoltage />
      </div>
      {/* <div><SetStatusFlag /></div> */}
    </div>
  );
};

export default App;
