import { useState } from "react";
import "./App.css";
import { FirstComeFirstServe } from "./components/FirstComeFirstServe/FirstComeFirstServe";
import { JsonUploader } from "./components/JsonUploader/JsonUploader";
import { RoundRobin } from "./components/RoundRobin/RoundRobin";
import { ShortestJobFirst } from "./components/ShortestJobFirst/ShortestJobFirst";
import { TimeSimulator } from "./components/TimeSimulator/TimeSimulator";
import { processes_1 } from "./data/data";
import { useGlobalTime } from "./store/GlobalTime";

export const App: React.FC = () => {
  const time = useGlobalTime((state) => state.time);

  const sortedProcesses = processes_1.sort((a, b) => a.starttime - b.starttime);

  const sorted2 = sortedProcesses.map((process) => ({ ...process }));
  const otherSequence = sortedProcesses.map((process) => ({ ...process }));
  const anotherSequence = sortedProcesses.map((process) => ({ ...process }));

  const [error, setError] = useState<string | null>(null);

  const handleJsonParsed = (data: object) => {
    setError(null); // Limpia errores previos
    console.log("JSON procesado:", data); // Muestra el JSON en la consola
  };

  const handleError = (error: string) => {
    setError(error); // Maneja errores
    console.error("Error procesando el JSON:", error); // Muestra el error en la consola
  };

  return (
    <>
      <TimeSimulator />
      <span>{time}</span>
      <br />

      <h1>Processes</h1>
      <RoundRobin quantum={3} initialProcesses={sortedProcesses} />
      <ShortestJobFirst initialProcesses={sorted2} />
      <ShortestJobFirst initialProcesses={otherSequence} />
      <FirstComeFirstServe initialProcess={anotherSequence} />

      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <JsonUploader onJsonParsed={handleJsonParsed} onError={handleError} />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
};
