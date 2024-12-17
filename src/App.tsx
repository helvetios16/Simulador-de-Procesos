import "./App.css";
import { useGlobalTime } from "./store/GlobalTime";
import { processes_1 } from "./data/data";
import { TimeSimulator } from "./components/TimeSimulator/TimeSimulator";
import { RoundRobin } from "./components/RoundRobin/RoundRobin";
import { ShortestJobFirst } from "./components/ShortestJobFirst/ShortestJobFirst";

export const App: React.FC = () => {
  const time = useGlobalTime((state) => state.time);

  const sortedProcesses = processes_1.sort(
    (a, b) => a.arrivalTime - b.arrivalTime,
  );

  return (
    <>
      <TimeSimulator />
      <span>{time}</span>
      <br />
      <h1>Processes</h1>
      <RoundRobin quantum={3} initialProcesses={sortedProcesses} />
      {/* <ShortestJobFirst initialProcesses={sortedProcesses} /> */}
    </>
  );
};
