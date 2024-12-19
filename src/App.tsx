import { useState } from "react";
import "./App.css";
import { FirstComeFirstServe } from "./components/FirstComeFirstServe/FirstComeFirstServe";
import { JsonUploader } from "./components/JsonUploader/JsonUploader";
import { RoundRobin } from "./components/RoundRobin/RoundRobin";
import { ShortestJobFirst } from "./components/ShortestJobFirst/ShortestJobFirst";
import { TimeSimulator } from "./components/TimeSimulator/TimeSimulator";
import { processes_1 } from "./data/data";
import { useGlobalTime } from "./store/GlobalTime";

import { CPU } from "./components/CPU/Cpu";
import { algoritmos } from "./components/Indice/Indice";

export const App: React.FC = () => {
  const [started, setStarted] = useState(false); // Estado para manejar si se ha presionado "Start"
  const [error, setError] = useState<string | null>(null);

  const [indiceAlgo, setIndiceAlgo] = useState(0);
  const [indiceAlgo2, setIndiceAlgo2] = useState(0);
  const [indiceAlgo3, setIndiceAlgo3] = useState(0);
  const [indiceAlgo4, setIndiceAlgo4] = useState(0);

  const time = useGlobalTime((state) => state.time);

  const sortedProcesses = processes_1.sort(
    (a, b) => a.arrivalTime - b.arrivalTime
  );

  const sorted2 = sortedProcesses.map((process) => ({ ...process }));
  const otherSequence = sortedProcesses.map((process) => ({ ...process }));
  const anotherSequence = sortedProcesses.map((process) => ({ ...process }));

  const handleJsonParsed = (data: object) => {
    setError(null); // Limpia errores previos
    console.log("JSON procesado:", data); // Muestra el JSON en la consola
  };

  const handleError = (error: string) => {
    setError(error); // Maneja errores
    console.error("Error procesando el JSON:", error); // Muestra el error en la consola
  };

  const startSimulacion = () => {
    const cpu = new CPU(indiceAlgo, algoritmos);
    sorted2.forEach((process) => cpu.addProceso(process));

    const output = cpu.runScheduler(); // Asume que `runScheduler` retorna un resultado
    console.log("Resultados del simulador:", output);

    setStarted(true); // Cambia a la vista de simulación  
  };

  const stopSimulacion = () => {
    setStarted(false);
  };


  if (!started) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>

        <h1>Especifique los algoritmos</h1>
        <div>
          <label>
            Algoritmo:
            <select
              value={indiceAlgo}
              onChange={(e) => setIndiceAlgo(Number(e.target.value))}
            >
              <option value={0}>FCFS (First-Come-First-Serve)</option>
              <option value={1}>SJF (Shortest Job First)</option>
              <option value={2}>RR (Round Robin)</option>
            </select>
          </label>
          <label>
            Algoritmo:
            <select
              value={indiceAlgo2}
              onChange={(e) => setIndiceAlgo2(Number(e.target.value))}
            >
              <option value={0}>FCFS (First-Come-First-Serve)</option>
              <option value={1}>SJF (Shortest Job First)</option>
              <option value={2}>RR (Round Robin)</option>
            </select>
          </label>
          <label>
            Algoritmo:
            <select
              value={indiceAlgo3}
              onChange={(e) => setIndiceAlgo3(Number(e.target.value))}
            >
              <option value={0}>FCFS (First-Come-First-Serve)</option>
              <option value={1}>SJF (Shortest Job First)</option>
              <option value={2}>RR (Round Robin)</option>
            </select>
          </label>
          <label>
            Algoritmo:
            <select
              value={indiceAlgo4}
              onChange={(e) => setIndiceAlgo4(Number(e.target.value))}
            >
              <option value={0}>FCFS (First-Come-First-Serve)</option>
              <option value={1}>SJF (Shortest Job First)</option>
              <option value={2}>RR (Round Robin)</option>
            </select>
          </label>
          <button
            style={{
              marginLeft: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            //onClick={() => setStarted(true)}
            onClick={()=> startSimulacion()}
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <h1>Processes</h1>
        <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => setStarted(false)} // Regresa a la pantalla inicial
        >
          Stop
        </button>
      </div>

      <TimeSimulator />
      <span>{time}</span>
      <br />

      {/* <h1>Processes</h1> */}
      <RoundRobin  procesos={sortedProcesses} opciones={3} tiempo={0} />
      <ShortestJobFirst procesos={sorted2} tiempo={0} />
      <ShortestJobFirst procesos={otherSequence} tiempo={0} />
      <FirstComeFirstServe procesos={anotherSequence} tiempo={0}/>

      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <JsonUploader onJsonParsed={handleJsonParsed} onError={handleError} />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
};
