import { useEffect, useState } from "react";
import "./ShortestJobFirst.css";
import { Process } from "../../interfaces/Process";
import { useGlobalTime } from "../../store/GlobalTime";

interface SJFProps {
  initialProcesses: Process[];
}

export const ShortestJobFirst: React.FC<SJFProps> = ({ initialProcesses }) => {
  const time: number = useGlobalTime((state) => state.time);

  const [waitingQueue, setWaitingQueue] = useState<Process[]>([
    ...initialProcesses,
  ]);
  const [readyQueue, setReadyQueue] = useState<Process[]>([]);
  const [executionOrder, setExecutionOrder] = useState<number[]>([]);
  const [internalTime, setInternalTime] = useState<number>(time);

  const delay = (seg: number) =>
    new Promise((resolve) => setTimeout(resolve, seg));

  // Arreglar, en estado inicial porner el proceso de arrivalTime 0 al inicio y luego ordernar lo demás
  const moveToReadyQueue = (t: number) => {
    setWaitingQueue((prev) => {
      let toReady = prev.filter((p) => p.starttime <= t);
      const remaining = prev.filter((p) => p.starttime > t);

      if (internalTime === 0) {
        const firstProcess = toReady.find((p) => p.starttime === 0);
        if (firstProcess) {
          toReady = [
            firstProcess,
            ...toReady.filter((p) => p.pid !== firstProcess.pid),
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
    setExecutionOrder((prev) => [...prev, currentProcess.pid]);

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
