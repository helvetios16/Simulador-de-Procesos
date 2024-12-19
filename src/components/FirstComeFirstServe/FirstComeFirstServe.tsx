import { useEffect, useState } from "react";
import { Process } from "../../interfaces/Process";
import { useGlobalTime } from "../../store/GlobalTime";

interface FCFSProps {
  initialProcess: Process[];
}

export const FirstComeFirstServe: React.FC<FCFSProps> = ({
  initialProcess,
}) => {
  const time: number = useGlobalTime((state) => state.time);
  const [waitingQueue, setWaitingQueue] = useState<Process[]>([
    ...initialProcess,
  ]);
  const [readyQueue, setReadyQueue] = useState<Process[]>([]);
  const [executionOrder, setExecutionOrder] = useState<number[]>([]);
  const [internalTime, setInternalTime] = useState<number>(time);

  const enQueueExecutionOrder = (str: number) => {
    setExecutionOrder((prev) => {
      const newItem = str;

      if (prev.includes(newItem)) {
        return prev;
      }

      if (prev.length >= 10) {
        return [...prev.slice(1), newItem];
      }

      return [...prev, newItem];
    });
  };

  const delay = (seg: number) =>
    new Promise((resolve) => setTimeout(resolve, seg));

  const moveToReadyQueue = (t: number) => {
    const toReady = waitingQueue.filter((p) => p.starttime <= t);
    setWaitingQueue((prev) => prev.filter((p) => p.starttime > t));
    setReadyQueue((prev) => [...prev, ...toReady]);
  };

  const executeProcess = async () => {
    if (readyQueue.length === 0) return;

    const currentProcess = readyQueue[0];
    setReadyQueue((prev) => prev.slice(1));

    const timeExecuted = currentProcess.remainingTime;
    currentProcess.remainingTime -= timeExecuted;

    setInternalTime((t) => t + timeExecuted);

    enQueueExecutionOrder(currentProcess.pid);

    await delay(timeExecuted * 1000);
  };

  useEffect(() => {
    setWaitingQueue([...initialProcess]);
  }, [initialProcess]);

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
      <h5>FCFS</h5>
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
