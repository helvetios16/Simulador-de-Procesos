type processState = "waiting" | "ready" | "running" | "finished";

export interface Process {
  id: string;
  arrivalTime: number;
  serviceTime: number;
  remainingTime: number;
  state: processState;
}
