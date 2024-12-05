import { useEffect } from "react";
import { useGlobalTime } from "../../store/GlobalTime";

export const TimeSimulator = () => {
  const incrementTime = useGlobalTime((state) => state.incrementTime);

  useEffect(() => {
    const interval = setInterval(() => {
      incrementTime();
    }, 1000);
    return () => clearInterval(interval);
  }, [incrementTime]);

  return null;
};
