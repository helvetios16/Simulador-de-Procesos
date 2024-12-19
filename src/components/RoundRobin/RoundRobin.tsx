import { useEffect, useState } from "react";
import { Process } from "../../interfaces/Process";
import { useGlobalTime } from "../../store/GlobalTime";
import "./RoundRobin.css";

interface RoundRobinProps {
  quantum: number;
  initialProcesses: Process[];
}

interface Order {
  pid: number;
  state: boolean;
}

export const RoundRobin: React.FC<RoundRobinProps> = ({
  quantum,
  initialProcesses,
}) => {
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
    const toReady = waitingQueue.filter((p) => p.starttime <= t);
    setWaitingQueue((prev) => prev.filter((p) => p.starttime > t));
    setReadyQueue((prev) => [...prev, ...toReady]);
  };

  const executeProcess = async () => {
    if (readyQueue.length === 0) return;

    const currentProcess = readyQueue[0];
    setReadyQueue((prev) => prev.slice(1));

    const timeExecuted = Math.min(quantum, currentProcess.remainingTime);
    currentProcess.remainingTime -= timeExecuted;

    setInternalTime((t) => t + timeExecuted);

    if (currentProcess.remainingTime > 0) {
      enQueueExecutionOrder(currentProcess.pid, false);
    } else {
      enQueueExecutionOrder(currentProcess.pid, true);
    }

    await delay(timeExecuted * 1000);

    if (currentProcess.remainingTime > 0) {
      setReadyQueue((prev) => [...prev, currentProcess]);
    }
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
      <h5>RR</h5>
      <div className="queue-roundrobin">
        {executionOrder.map((item, index) => (
          <span key={index} className={`queue-item ${item.state ? "red" : ""}`}>
            {item.pid}
          </span>
        ))}
      </div>
    </>
  );
};
