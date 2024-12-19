import { useEffect, useState } from "react";
import "./ShortestJobFirst.css";
import { Process } from "../../interfaces/Process";
import { useGlobalTime } from "../../store/GlobalTime";

interface SJFProps {
  initialProcesses: Process[];
}

interface Order {
  pid: number;
  state: boolean;
}

export const ShortestJobFirst: React.FC<SJFProps> = ({ initialProcesses }) => {
  const time: number = useGlobalTime((state) => state.time);

  const [waitingQueue, setWaitingQueue] = useState<Process[]>([
    ...initialProcesses,
  ]);
  const [readyQueue, setReadyQueue] = useState<Process[]>([]);
  const [executionOrder, setExecutionOrder] = useState<Order[]>([]);
  const [internalTime, setInternalTime] = useState<number>(time);

  const enQueueExecutionOrder = (id: number, st: boolean) => {
    setExecutionOrder((prev) => {
      const order: Order = { pid: id, state: st };

      if (prev.includes(order)) {
        return prev;
      }

      if (prev.length >= 10) {
        return [...prev.slice(1), order];
      }

      return [...prev, order];
    });
  };

  const delay = (seg: number) =>
    new Promise((resolve) => setTimeout(resolve, seg));

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
    enQueueExecutionOrder(currentProcess.pid, false);

    await delay(timeExecuted * 1000);
  };

  useEffect(() => {
    setWaitingQueue([...initialProcesses, ...waitingQueue]);
  }, [initialProcesses]);

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
        {executionOrder.map((item, index) => (
          <span key={index} className={`queue-item ${item.state ? "red" : ""}`}>
            {item.pid}
          </span>
        ))}
      </div>
    </>
  );
};
