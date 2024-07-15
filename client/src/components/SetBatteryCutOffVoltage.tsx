import { useEffect, useState } from "react";
import {
  setInverterParameters,
  queryInverterParameters,
} from "../services/api";

const SetBatteryCutOffVoltage = () => {
  const [response, setResponse] = useState<string>("");
  const [list, setList] = useState<string[]>([]);
  const [ratingVoltage, setRatingVoltage] = useState<number | null>(null);
  const [frequency, setFrequency] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const TwelveVolt = [
    "Select Voltage",
    "11.5V",
    "11.6V",
    "12.8V",
    "12.9V",
    "12.1V",
    "12.2V",
    "12.3V",
    "12.5V",
    "12.6V",
    "12.7V",
  ];
  const TwentyFourVolt = [
    "Select Voltage",
    "21.0V",
    "21.5V",
    "22.0V",
    "22.5V",
    "23.0V",
    "23.5V",
    "24.0V",
    "24.5V",
    "25.0V",
    "25.5V",
    "26.0V",
  ];
  const FortyEightVolt = [
    "Select Voltage",
    "46.0V",
    "46.5V",
    "46.8V",
    "47.V",
    "47.4V",
    "47.8V",
    "48.4V",
    "48.8V",
    "49.0V",
    "49.5V",
    "50.0V",
  ];

  useEffect(() => {
    const checkBatteryRatingVoltage = async () => {
      try {
        const res = await queryInverterParameters("QPIRI");
        const reVolt = Number(res[0].batteryRatingVoltage);
        setRatingVoltage(reVolt);
        console.log("Battery Rating Voltage:", res[0].batteryRatingVoltage);

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
        setError("Failed to get Battery Rating Voltage.");
      }
    };
    checkBatteryRatingVoltage();
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
      const res = await setInverterParameters("PSDV", frequency);
      setResponse(res[0].response);
      console.log(res[0].response);
    } catch (err) {
      setError("Failed to Change Value.");
    }
  };

  return (
    <div className="bg-[grey] flex flex-col mt-[50px] w-screen h-auto p-[20px] rounded-md">
      <span style={{ fontSize: "24px" }}>
        Battery Rating Volt: {ratingVoltage}
      </span>
      <span style={{ fontSize: "24px" }}>Set Battery Under Voltage:</span>
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

export default SetBatteryCutOffVoltage;
