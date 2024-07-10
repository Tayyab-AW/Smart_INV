import { useState } from "react";
import { setInverterParameters } from "../services/api";

const SetToDefault = () => {
  const [response, setResponse] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await setInverterParameters("PF", data);
      setResponse(res[0].response);
      console.log(res[0].response);
    } catch (err) {
      setError("Failed to Restore Default.");
    }
  };

  return (
    <div style={{display: "flex" , flexDirection: 'column', marginTop: '50px'}}>
      <form onSubmit={handleSubmit}>
        <button type="submit"> Restore Default</button>
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

export default SetToDefault;
