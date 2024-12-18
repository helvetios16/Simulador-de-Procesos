export interface Process {
  pid: number;
  name: string;
  starttime: number;
  serviceTime: number;
  remainingTime: number;
  priority: number;
}
