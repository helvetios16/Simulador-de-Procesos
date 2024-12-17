import { useEffect, useState } from "react";
import { Process } from "../../interfaces/Process";
import { useGlobalTime } from "../../store/GlobalTime";
import "./ShortestJobFirst.css";

interface SJFProps {
  initialProcesses: Process[];
}

export const ShortestJobFirst: React.FC<SJFProps> = ({ initialProcesses }) => {
  const time: number = useGlobalTime((state) => state.time);

  const [waitingQueue, setWaitingQueue] = useState<Process[]>([
    ...initialProcesses,
  ]);
  const [readyQueue, setReadyQueue] = useState<Process[]>([]);
  const [executionOrder, setExecutionOrder] = useState<string[]>([]);
  const [internalTime, setInternalTime] = useState<number>(time);

  const delay = (seg: number) =>
    new Promise((resolve) => setTimeout(resolve, seg));

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
      <h5>Shortest Job First</h5>
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
