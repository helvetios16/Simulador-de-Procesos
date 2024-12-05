class Process {
  id: string;
  arrivalTime: number;
  serviceTime: number;
  remainingTime: number;
  state: "waiting" | "ready" | "running" | "finished";

  constructor(id: string, arrivalTime: number, serviceTime: number) {
    this.id = id;
    this.arrivalTime = arrivalTime;
    this.serviceTime = serviceTime;
    this.remainingTime = serviceTime;
    this.state = "waiting";
  }
}

class RoundRobinScheduler {
  private waitingQueue: Process[] = [];
  private readyQueue: Process[] = [];
  private time: number = 0;
  private isRunning: boolean = false;

  constructor(private quantum: number) {}

  addProcess(process: Process): void {
    this.waitingQueue.push(process);
    this.waitingQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
  }

  private moveToReadyQueue(): void {
    const toReady: Process[] = this.waitingQueue.filter(
      (p) => p.arrivalTime <= this.time,
    );
    this.waitingQueue = this.waitingQueue.filter(
      (p) => p.arrivalTime > this.time,
    );

    if (toReady.length > 0) {
      this.readyQueue.push(...toReady);
    }
  }

  async start(): Promise<void> {
    this.isRunning = true;

    while (this.isRunning) {
      this.moveToReadyQueue();
      if (this.readyQueue.length === 0) {
        if (this.waitingQueue.length === 0) {
          this.stop();
        } else {
          this.time++;
          await this.wait(1000);
        }
        continue;
      }

      const currentProcess: Process = this.readyQueue.shift()!;
      const timeExecuted = Math.min(this.quantum, currentProcess.remainingTime);

      process.stdout.write(`${currentProcess.id} `);
      await this.wait(timeExecuted * 1000);

      currentProcess.remainingTime -= timeExecuted;
      this.time += timeExecuted;

      this.moveToReadyQueue();

      if (currentProcess.remainingTime > 0) {
        this.readyQueue.push(currentProcess);
      }
    }
  }

  stop(): void {
    this.isRunning = false;
  }

  private wait(segs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, segs));
  }
}

const scheduler = new RoundRobinScheduler(3);

scheduler.addProcess(new Process("A", 0, 6));
scheduler.addProcess(new Process("B", 5, 4));
scheduler.addProcess(new Process("C", 3, 3));
scheduler.addProcess(new Process("D", 10, 4));

scheduler.start();
