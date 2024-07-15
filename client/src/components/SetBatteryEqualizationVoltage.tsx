import { useEffect, useState } from "react";
import {
  setInverterParameters,
  queryInverterParameters,
} from "../services/api";

const SetBatteryEqualizationVoltage = () => {
  const [response, setResponse] = useState<string>("");
  const [list, setList] = useState<string[]>([]);
  const [ratingVoltage, setRatingVoltage] = useState<number | null>(null);
  const [frequency, setFrequency] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const TwelveVolt = ["Select Voltage", "12.0V", "12.5V", "13.0V", "13.5V"];
  const TwentyFourVolt = [
    "Select Voltage",
    "24.0V",
    "24.5V",
    "25.0V",
    "25.5V",
    "26.0V",
    "26.5V",
    "27.0V",
    "27.5V",
    "28.0V",
    "28.5V",
    "29.0V",
    "29.5V",
    "30.0V",
    "30.5V",
    "31.0V",
    "31.5V",
  ];
  const FortyEightVolt = [
    "Select Voltage",
    "48.0V",
    "49.0V",
    "50.0V",
    "51.0V",
    "52.0V",
    "53.0V",
    "54.0V",
    "55.0V",
    "56.0V",
    "57.0V",
    "58.0V",
    "59.0V",
    "60.0V",
    "61.0V",
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
      const res = await setInverterParameters("PBEQV", frequency);
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
      <span style={{ fontSize: "24px" }}>Set Battery Float Voltage:</span>
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

export default SetBatteryEqualizationVoltage;
