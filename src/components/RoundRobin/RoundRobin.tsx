import { useEffect, useState } from "react";
import { Process } from "../../interfaces/Process";
import { useGlobalTime } from "../../store/GlobalTime";
import "./RoundRobin.css";

interface RRProps {
  procesos: Process[];
  tiempo: number;
  opciones?: any;
}


export const RoundRobin:  React.FC<RRProps> = ({procesos, tiempo, opciones}) => {
  const time: number = useGlobalTime((state) => state.time);

  const [waitingQueue, setWaitingQueue] = useState<Process[]>([
    ...procesos,
  ]);
  const [readyQueue, setReadyQueue] = useState<Process[]>([]);
  const [executionOrder, setExecutionOrder] = useState<string[]>([]);
  const [internalTime, setInternalTime] = useState<number>(time);

  const enQueueExecutionOrder = (str: string) => {
    setExecutionOrder((prev) => {
      const newItem = `${str}`;
      if (prev.length >= 6) {
        return [...prev.slice(1), newItem];
      }
      return [...prev, newItem];
    });
  };

  const delay = (seg: number) =>
    new Promise((resolve) => setTimeout(resolve, seg));

  const moveToReadyQueue = (t: number) => {
    const toReady = waitingQueue.filter((p) => p.arrivalTime <= t);
    setWaitingQueue((prev) => prev.filter((p) => p.arrivalTime > t));
    setReadyQueue((prev) => [...prev, ...toReady]);
  };

  const executeProcess = async () => {
    if (readyQueue.length === 0) return;

    const currentProcess = readyQueue[0];
    setReadyQueue((prev) => prev.slice(1));

    const timeExecuted = Math.min(opciones, currentProcess.remainingTime);
    currentProcess.remainingTime -= timeExecuted;

    setInternalTime((t) => t + timeExecuted);
    // setExecutionOrder((prev) => [...prev, currentProcess.id]);
    enQueueExecutionOrder(currentProcess.id);

    await delay(timeExecuted * 1000);

    if (currentProcess.remainingTime > 0) {
      setReadyQueue((prev) => [...prev, currentProcess]);
    }
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
      <h5>RR</h5>
      <div className="queue-roundrobin">
        {executionOrder.map((id, index) => (
          <span key={index} className="queue-item">
            {id}
          </span>
        ))}
      </div>
    </>
  );
};
