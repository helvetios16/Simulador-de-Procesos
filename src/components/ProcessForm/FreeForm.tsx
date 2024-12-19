import React, { useState } from "react";

interface FreeFormProps {
  onFreeProcess: (pidProcess: number) => void;
}

export const FreeForm: React.FC<FreeFormProps> = ({ onFreeProcess }) => {
  const [pid, setPid] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pidProcess: number = pid;

    onFreeProcess(pidProcess);

    setPid(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>PID:</label>
        <input
          type="number"
          value={pid}
          onChange={(e) => setPid(Number(e.target.value))}
          required
        />
      </div>
      <button type="submit" style={{ marginTop: "20px" }}>
        Free Process
      </button>
    </form>
  );
};
