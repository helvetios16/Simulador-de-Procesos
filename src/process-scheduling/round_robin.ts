class Process {
  id: string;
  arrivalTime: number;
  serviceTime: number;
  state: string;

  constructor(id: string, arrivalTime: number, serviceTime: number) {
    this.id = id;
    this.arrivalTime = arrivalTime;
    this.serviceTime = serviceTime;
    this.state = "waiting";
  }
}

function insertionSort(processes: Process[], numProcess: number): Process[] {
  for (let i = 1; i < numProcess; i++) {
    const key: Process = processes[i];
    let j: number = i - 1;

    while (j >= 0 && processes[j].arrivalTime > key.arrivalTime) {
      processes[j + 1] = processes[j];
      j--;
    }

    processes[j + 1] = key;
  }

  return processes;
}

function roundRobin(
  processes: Process[],
  numProcess: number,
  quantum: number,
): void {
  const sortProcesses: Process[] = insertionSort(processes, numProcess);

  let currentTime: number = 0;
  let remainingProcesses: number = numProcess;

  const readyQueue: Process[] = [];

  while (remainingProcesses > 0) {
    for (const process of sortProcesses) {
      if (
        process.arrivalTime <= currentTime &&
        process.state === "waiting" &&
        process.serviceTime > 0 &&
        !readyQueue.includes(process)
      ) {
        process.state = "ready";
        readyQueue.push(process);
      }
    }

    const currentProcess: Process | undefined = readyQueue.shift();

    if (currentProcess) {
      const timeExecute: number = Math.min(currentProcess.serviceTime, quantum);
      currentProcess.serviceTime -= timeExecute;
      currentTime += timeExecute;

      for (const process of sortProcesses) {
        if (
          process.arrivalTime <= currentTime &&
          process.state === "waiting" &&
          process.serviceTime > 0 &&
          process.id !== currentProcess.id
        ) {
          process.state = "ready";
          readyQueue.push(process);
        }
      }

      // console.log(
      //   `${currentProcess.id} [${readyQueue.map((p) => p.id).join(", ")}]`,
      // );
      console.log(`${currentProcess.id} `);
      // process.stdout.write(`${currentProcess.id} `);

      if (currentProcess.serviceTime === 0) {
        currentProcess.state = "finished";
        remainingProcesses--;
      } else {
        currentProcess.state = "processed";
        readyQueue.push(currentProcess);
      }
    } else {
      currentTime++;
    }
  }

  console.log();
}

// function main(): void {
//   const numProcess: number = 5;
//   const processes: Process[] = [
//     new Process("P1", 0, 6),
//     new Process("P2", 1, 3),
//     new Process("P3", 3, 4),
//     new Process("P4", 5, 5),
//     new Process("P5", 6, 2),
//   ];
//   const quantum: number = 2;
//
//   roundRobin(processes, numProcess, quantum);
// }

// function main(): void {
//   const numProcess: number = 4;
//   const processes: Process[] = [
//     new Process("P1", 0, 5),
//     new Process("P2", 1, 4),
//     new Process("P3", 2, 2),
//     new Process("P4", 4, 1),
//   ];
//   const quantum: number = 2;
//
//   roundRobin(processes, numProcess, quantum);
// }

function main(): void {
  const numProcess: number = 3;
  const processes: Process[] = [
    new Process("A", 0, 6),
    new Process("B", 5, 4),
    new Process("C", 3, 3),
    // new Process("D", 5, 5),
    // new Process("E", 3, 1),
  ];
  const quantum: number = 3;

  roundRobin(processes, numProcess, quantum);
}

main();
