import "./App.css";
import { useGlobalTime } from "./store/GlobalTime";
import { TimeSimulator } from "./components";

export const App: React.FC = () => {
  const time = useGlobalTime((state) => state.time);
  return (
    <>
      <TimeSimulator />
      <span>{time}</span>
      <br />

      <h1>Processes</h1>
    </>
  );
};
