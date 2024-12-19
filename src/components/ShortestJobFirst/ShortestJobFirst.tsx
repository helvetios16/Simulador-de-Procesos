import { useEffect, useState } from "react";
import "./ShortestJobFirst.css";
import { Process } from "../../interfaces/Process";
import { useGlobalTime } from "../../store/GlobalTime";

interface SJFProps {
  procesos: Process[];
  tiempo: number;
  opciones?: any;
}

export const ShortestJobFirst: React.FC<SJFProps> = ({procesos, tiempo, opciones}) => {
  const time: number = useGlobalTime((state) => state.time);

  const [waitingQueue, setWaitingQueue] = useState<Process[]>([
    ...procesos,
  ]);
  const [readyQueue, setReadyQueue] = useState<Process[]>([]);
  const [executionOrder, setExecutionOrder] = useState<string[]>([]);
  const [internalTime, setInternalTime] = useState<number>(time);

  const delay = (seg: number) =>
    new Promise((resolve) => setTimeout(resolve, seg));

  // Arreglar, en estado inicial porner el proceso de arrivalTime 0 al inicio y luego ordernar lo demás
  const moveToReadyQueue = (t: number) => {
    setWaitingQueue((prev) => {
      let toReady = prev.filter((p) => p.arrivalTime <= t);
      const remaining = prev.filter((p) => p.arrivalTime > t);

      if (internalTime === 0) {
        const firstProcess = toReady.find((p) => p.arrivalTime === 0);
        if (firstProcess) {
          toReady = [
            firstProcess,
            ...toReady.filter((p) => p.id !== firstProcess.id),
          ];
        }
      }

      setReadyQueue((prevReady) =>
        [...prevReady, ...toReady].sort(
          (a, b) => a.serviceTime - b.serviceTime,
        ),
      );

      return remaining;
    });
  };

  const executeProcess = async () => {
    if (readyQueue.length === 0) return;

    const currentProcess = readyQueue[0];
    setReadyQueue((prev) => prev.slice(1));

    const timeExecuted = currentProcess.remainingTime;
    currentProcess.remainingTime -= timeExecuted;

    setInternalTime((t) => t + timeExecuted);
    setExecutionOrder((prev) => [...prev, currentProcess.id]);

    await delay(timeExecuted * 1000);
  };

  useEffect(() => {
    const processExecution = async () => {
      moveToReadyQueue(time);
      await executeProcess();
    };

    if (internalTime <= time) {
      processExecution();
    }
  }, [time, internalTime]);

  return (
    <>
      <h5>SJF</h5>
      <div className="queue-sfj">
        {executionOrder.map((id, index) => (
          <span key={index} className="queue-item">
            {id}
          </span>
        ))}
      </div>
    </>
  );
};
