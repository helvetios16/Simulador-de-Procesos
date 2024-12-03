import { useEffect, useState } from "react";
import "./Queue.css";

type QueueItem = string;

export const Queue: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const enqueue = () => {
    setQueue((prevQueue) => {
      const newItem = `${counter + 1}`;
      if (prevQueue.length >= 10) {
        return [...prevQueue.slice(1), newItem];
      }
      return [...prevQueue, newItem];
    });
    setCounter((prevCounter) => prevCounter + 1);
  };

  const dequeue = () => {
    setQueue((prevQueue) =>
      prevQueue.length > 0 ? prevQueue.slice(1) : prevQueue,
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setQueue((prevQueue) => {
        const nextCounter: string = `${counter + 1}`;
        if (prevQueue.length >= 10) {
          return [...prevQueue.slice(1), `${nextCounter}`];
        }
        return [...prevQueue, `${nextCounter}`];
      });
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [counter]);

  return (
    <>
      <div className="queue">
        {queue.length === 0 && (
          <div
            className="queue-item placeholder"
            style={{ backgroundColor: "transparent", height: "24px" }}
          ></div>
        )}
        {queue.map((item, index) => (
          <div key={index} className="queue-item">
            {item}
          </div>
        ))}
      </div>
      <button onClick={enqueue}>Add</button>
      <button onClick={dequeue}>Delete</button>
    </>
  );
};
