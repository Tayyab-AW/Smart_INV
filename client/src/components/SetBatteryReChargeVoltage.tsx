import { useEffect, useState } from "react";
import {
  setInverterParameters,
  queryInverterParameters,
} from "../services/api";

const SetBatteryReChargeVoltage = () => {
  const [response, setResponse] = useState<string>("");
  const [list, setList] = useState<string[]>([]);
  const [ratingVoltage, setRatingVoltage] = useState<number | null>(null);
  const [frequency, setFrequency] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const TwelveVolt = [
    "Select Voltage",
    "11.0V",
    "11.3V",
    "11.5V",
    "11.8V",
    "12.0V",
    "12.3V",
    "12.5V",
    "12.8V",
  ];
  const TwentyFourVolt = [
    "Select Voltage",
    "22.0V",
    "22.5V",
    "23.0V",
    "23.5V",
    "24.0V",
    "24.5V",
    "25.0V",
    "25.5V",
  ];
  const FortyEightVolt = [
    "Select Voltage",
    "44.0V",
    "45.0V",
    "46.0V",
    "47.0V",
    "48.0V",
    "49.0V",
    "50.0V",
    "51.0V",
  ];

  useEffect(() => {
    const checkBatteryVoltage = async () => {
      try {
        const res = await queryInverterParameters("QPIRI");
        const reVolt = Number(res[0].batteryRatingVoltage);
        setRatingVoltage(reVolt);
        console.log("Recharge Voltage:", res[0].batteryRatingVoltage);

        setList(
          reVolt === 48
            ? FortyEightVolt
            : reVolt === 24
            ? TwentyFourVolt
            : reVolt === 12
            ? TwelveVolt
            : []
        );
      } catch (err) {
        setError("Failed to get Recharge Voltage.");
      }
    };
    checkBatteryVoltage();
  }, []);

  const listOptions = list.map((volt: string) => (
    <option key={volt} value={volt}>
      {volt}
    </option>
  ));

  const handleCommandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const frequencyValue = e.target.value.replace(/[^0-9 .]/g, "");
    setFrequency(frequencyValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await setInverterParameters("PBCV", frequency);
      setResponse(res[0].response);
      console.log(res[0].response);
    } catch (err) {
      setError("Failed to Restore Default.");
    }
  };

  return (
    <div className="bg-[grey] flex flex-col mt-[50px] w-screen h-auto p-[20px] rounded-md">
      <span style={{ fontSize: "24px" }}>
        Battery Rating Volt: {ratingVoltage}
      </span>
      <span style={{ fontSize: "24px" }}>Set Battery Recharge Voltage:</span>
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

export default SetBatteryReChargeVoltage;
