import { useEffect, useState } from "react";
import { Process } from "../../interfaces/Process";
import { useGlobalTime } from "../../store/GlobalTime";

interface FCFSProps {
  initialProcess: Process[];
  freeProcess: number | null;
}

interface Order {
  pid: number;
  state: boolean;
}

export const FirstComeFirstServe: React.FC<FCFSProps> = ({
  initialProcess,
  freeProcess,
}) => {
  const time: number = useGlobalTime((state) => state.time);
  const [waitingQueue, setWaitingQueue] = useState<Process[]>([
    ...initialProcess,
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

    const timeExecuted = currentProcess.remainingTime;
    currentProcess.remainingTime -= timeExecuted;

    setInternalTime((t) => t + timeExecuted);

    enQueueExecutionOrder(currentProcess.pid, false);

    if (freeProcess == currentProcess.pid) {
      alert(`Proceso con PID: ${freeProcess} eliminado de la ejecución`);
      return;
    }

    await delay(timeExecuted * 1000);
  };

  useEffect(() => {
    setWaitingQueue([...initialProcess, ...waitingQueue]);
  }, [initialProcess]);

  useEffect(() => {
    if (freeProcess) {
      let processFound = false;

      setWaitingQueue((prevQueue) => {
        const updatedQueue = prevQueue.filter((p) => p.pid !== freeProcess);
        if (updatedQueue.length !== prevQueue.length) {
          processFound = true;
          alert(
            `Proceso con PID: ${freeProcess} eliminado de la cola de espera`,
          );
        }
        return updatedQueue;
      });

      setReadyQueue((prevQueue) => {
        const updatedQueue = prevQueue.filter((p) => p.pid !== freeProcess);
        if (updatedQueue.length !== prevQueue.length) {
          processFound = true;
          alert(
            `Proceso con PID: ${freeProcess} eliminado de la cola de listos`,
          );
        }
        return updatedQueue;
      });

      if (!processFound) {
        alert("El proceso no existe en ninguna cola");
      }
    }
  }, [freeProcess]);

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
        {executionOrder.map((item, index) => (
          <span key={index} className={`queue-item ${item.state ? "red" : ""}`}>
            {item.pid}
          </span>
        ))}
      </div>
    </>
  );
};
