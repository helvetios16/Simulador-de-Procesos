import React, { useState } from "react";
import { Process } from "../../interfaces/Process";

interface ProcessFormProps {
  onAddProcess: (newProcess: Process) => void;
}

export const ProcessForm: React.FC<ProcessFormProps> = ({ onAddProcess }) => {
  const [pid, setPid] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [starttime, setStarttime] = useState<number>(0);
  const [serviceTime, setServiceTime] = useState<number>(1);
  const [priority, setPriority] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (serviceTime <= 0) {
      alert("Service time must be greater than 0");
      return;
    }

    const newProcess: Process = {
      pid,
      name,
      starttime,
      serviceTime,
      remainingTime: serviceTime,
      priority,
    };

    onAddProcess(newProcess);

    setPid(0);
    setName("");
    setStarttime(0);
    setServiceTime(1);
    setPriority(0);
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
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Start Time:</label>
        <input
          type="number"
          value={starttime}
          onChange={(e) => setStarttime(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label>Service Time:</label>
        <input
          type="number"
          value={serviceTime}
          onChange={(e) => setServiceTime(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label>Priority:</label>
        <input
          type="number"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        />
      </div>
      <button type="submit" style={{ marginTop: "20px" }}>
        Add Process
      </button>
    </form>
  );
};
