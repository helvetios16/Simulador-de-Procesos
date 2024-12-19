import { useState } from "react";
import "./App.css";
import { FirstComeFirstServe } from "./components/FirstComeFirstServe/FirstComeFirstServe";
import { JsonUploader } from "./components/JsonUploader/JsonUploader";
import { RoundRobin } from "./components/RoundRobin/RoundRobin";
import { ShortestJobFirst } from "./components/ShortestJobFirst/ShortestJobFirst";
import { TimeSimulator } from "./components/TimeSimulator/TimeSimulator";
import { processes_1 } from "./data/data";
import { useGlobalTime } from "./store/GlobalTime";
import { Process } from "./interfaces/Process";
import { ProcessForm } from "./components/ProcessForm/ProcessForm";

export const App: React.FC = () => {
  const time = useGlobalTime((state) => state.time);

  const sortedProcesses = processes_1.sort((a, b) => a.starttime - b.starttime);

  const sorted2 = sortedProcesses.map((process) => ({ ...process }));
  const otherSequence = sortedProcesses.map((process) => ({ ...process }));
  // const anotherSequence = sortedProcesses.map((process) => ({ ...process }));

  const [dynamicProcess, setDynamicProcess] = useState<Process[]>([]);

  const handleAddProcess = (newProcess: Process) => {
    setDynamicProcess((prev) => [...prev, newProcess]);
  };

  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleJsonParsed = (data: object) => {
    setError(null);
    console.log("JSON procesado:", data);
  };

  const handleError = (error: string) => {
    setError(error);
    console.error("Error procesando el JSON:", error);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <>
      {isRunning && <TimeSimulator />} <span>{time}</span>
      <br />
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleStart} disabled={isRunning}>
          Start
        </button>
        <button onClick={handleStop} disabled={!isRunning}>
          Stop
        </button>
      </div>
      <h1>Processes</h1>
      <RoundRobin quantum={3} initialProcesses={sortedProcesses} />
      <ShortestJobFirst initialProcesses={sorted2} />
      <ShortestJobFirst initialProcesses={otherSequence} />
      <FirstComeFirstServe initialProcess={dynamicProcess} />
      <div style={{ marginTop: "20px" }}>
        <h3>Add Process</h3>
        <ProcessForm onAddProcess={handleAddProcess} />
      </div>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <JsonUploader onJsonParsed={handleJsonParsed} onError={handleError} />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
};
