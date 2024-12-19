type processState = "waiting" | "ready" | "running" | "finished";
import { ReactElement } from "react";
export interface Process {
  id: string;
  arrivalTime: number;
  serviceTime: number;
  remainingTime: number;
  state: processState;
}

