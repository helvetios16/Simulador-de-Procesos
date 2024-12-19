import { useState } from "react";
import "./App.css";
import { FirstComeFirstServe } from "./components/FirstComeFirstServe/FirstComeFirstServe";
import { JsonUploader } from "./components/JsonUploader/JsonUploader";
import { RoundRobin } from "./components/RoundRobin/RoundRobin";
import { ShortestJobFirst } from "./components/ShortestJobFirst/ShortestJobFirst";
import { TimeSimulator } from "./components/TimeSimulator/TimeSimulator";
import { useGlobalTime } from "./store/GlobalTime";
import { Process } from "./interfaces/Process";
import { ProcessForm } from "./components/ProcessForm/ProcessForm";

export const App: React.FC = () => {
  const time = useGlobalTime((state) => state.time);

  const [cpuOne, setCpuOne] = useState<Process[]>([]);
  const [cpuTwo, setCpuTwo] = useState<Process[]>([]);
  const [cpuThree, setCpuThree] = useState<Process[]>([]);
  const [cpuFour, setCpuFour] = useState<Process[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleAddProcess = (process: Process) => {
    console.log(
      `Distribuyendo proceso PID: ${process.pid} con prioridad: ${process.priority} con tiempo de llegada: ${process.starttime}`,
    );

    if (process.priority <= 8) {
      setCpuOne([process]); // Round Robin
    } else if (process.priority > 8 && process.priority <= 16) {
      setCpuTwo([process]); // SJF 1
    } else if (process.priority > 16 && process.priority <= 24) {
      setCpuThree([process]); // SJF 2
    } else {
      setCpuFour([process]); // FCFS
    }
  };

  const handleJsonParsed = (data: object) => {
    const Data = data as Process[];
    setError(null);

    console.log("Datos originales:", Data);

    const minus: number = Data[0]?.starttime || 0; // Manejo de seguridad por si Data está vacío

    const adjustedProcesses = Data.map((process) => ({
      ...process,
      starttime: Math.round(Math.abs((process.starttime - minus) / 1000)),
    }));

    const CpuOne: Process[] = [];
    const CpuTwo: Process[] = [];
    const CpuThree: Process[] = [];
    const CpuFour: Process[] = [];

    adjustedProcesses.forEach((process) => {
      if (process.priority <= 8) {
        CpuOne.push(process);
      } else if (process.priority > 8 && process.priority <= 16) {
        CpuTwo.push(process);
      } else if (process.priority > 16 && process.priority <= 24) {
        CpuThree.push(process);
      } else {
        CpuFour.push(process);
      }
    });

    console.log("CPU 1 antes de actualizar el estado:", CpuOne);
    setCpuOne([...CpuOne]);
    setCpuTwo([...CpuTwo]);
    setCpuThree([...CpuThree]);
    setCpuFour([...CpuFour]);

    alert("JSON procesado");
  };

  const handleError = (error: string) => {
    setError(error);
    alert("Error procesando el JSON");
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
      <RoundRobin quantum={3} initialProcesses={cpuOne} />
      <ShortestJobFirst initialProcesses={cpuTwo} />
      <ShortestJobFirst initialProcesses={cpuThree} />
      <FirstComeFirstServe initialProcess={cpuFour} />
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
