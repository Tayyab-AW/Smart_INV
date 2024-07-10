import { useState } from "react";
import { setToDefault } from "../services/api";

const SetToDefault = () => {
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await setToDefault("PF");
      setResponse(data.response);
      console.log(data);
    } catch (err) {
      setError("Failed to Restore Default.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit"> Restore Default</button>
      </form>

      {response && (
        <div>
          <h3>Response</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && <div>{error}</div>}
    </div>
  );
};

export default SetToDefault;
