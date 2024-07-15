import { useState, useEffect } from "react";
import {
  setInverterParameters,
  queryInverterParameters,
} from "../services/api";

interface FlagsArray {
  [key: string]: string;
}
const flagDescriptions: FlagsArray = {
  a: "Silence buzzer",
  b: "Overload bypass function",
  j: "Power saving",
  k: "LCD display escape to default page after 1min timeout",
  u: "Overload restart",
  v: "Over temperature restart",
  x: "Backlight on",
  y: "Alarm on when primary source interrupt",
  z: "Fault code record",
};

const SetStatusFlag = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [flags, setFlags] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const fetchQFlag = async () => {
    try {
      const res = await queryInverterParameters("QFLAG");
      console.log(res);
      const enabledFlags = res[0].enabledFlags.reduce(
        (acc: any | string, flag: string) => ({ ...acc, [flag]: true }),
        {}
      );
      const disabledFlags = res[0].disabledFlags.reduce(
        (acc: any | string, flag: string) => ({ ...acc, [flag]: false }),
        {}
      );
      setFlags({ ...enabledFlags, ...disabledFlags });
      setLoading(false);
    } catch (err) {
      setError("Failed to Get QFLAG.");
    }
  };

  useEffect(() => {
    fetchQFlag();
  }, []);

  const handleFlagChange = async (flag: string, isEnabled: boolean) => {
    setLoading(true);
    const commandPrefix = isEnabled ? "PD" : "PE";
    try {
      await setInverterParameters(commandPrefix, flag);
      setFlags((prevFlags) => ({
        ...prevFlags,
        [flag]: isEnabled,
      }));
      fetchQFlag();
    } catch (err) {
      setError("Failed to Set Flag.");
    }
  };

  return (
    <div className="bg-[grey] flex flex-col mt-[50px] w-screen h-auto p-[20px] rounded-md">
      {loading ? (
        <div>Loading</div>
      ) : (
        <div>
          <h2>Set Status Flag</h2>
          {Object.keys(flagDescriptions).map((flag) => (
            <div
              key={flag}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: flags[flag] ? "green" : "grey",
                  marginRight: "10px",
                }}
              ></div>
              <span style={{ flexGrow: 1 }}>{flagDescriptions[flag]}</span>
              <button onClick={() => handleFlagChange(flag, flags[flag])}>
                {flags[flag] ? "Disable" : "Enable"}
              </button>
            </div>
          ))}
          {error && <div>{error}</div>}
        </div>
      )}
    </div>
  );
};

export default SetStatusFlag;
