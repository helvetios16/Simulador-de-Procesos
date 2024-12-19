type Process = {
    id: number;
    arrivalTime: number; // Tiempo de llegada
    burstTime: number;   // Tiempo de ejecución total
    remainingTime: number; // Tiempo restante por ejecutar
    startTime?: number;  // Tiempo en que empieza a ejecutarse
    completionTime?: number; // Tiempo en que termina su ejecución
};

type Processor = {
    id: number;
    process: Process | null; // Proceso actual asignado
};

type SchedulingAlgorithm = (queue: Process[], time: number) => Process | null;

/**
 *Simulador de planificación simétrica de procesos
*/
function symmetricScheduler(
    processes: Process[],
    numProcessors: number,
    schedulingAlgorithm: SchedulingAlgorithm
): Process[] {
    // Cola de procesos ordenada por tiempo de llegada
    const readyQueue: Process[] = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Procesadores inicializados como libres
    const processors: Processor[] = Array.from({ length: numProcessors }, (_, id) => ({
        id,
        process: null,
    }));

    const completedProcesses: Process[] = [];
    let time = 0;

    // Simulación de planificación
    while (readyQueue.length > 0 || processors.some((p) => p.process !== null)) {
        // Asignar procesos a procesadores disponibles
        for (const processor of processors) {
            if (!processor.process) {
                const nextProcess = schedulingAlgorithm(readyQueue, time);
                if (nextProcess) {
                    processor.process = nextProcess;
                    readyQueue.splice(readyQueue.indexOf(nextProcess), 1);
                    nextProcess.startTime = time;
                }
            }
        }

        // Ejecutar procesos en cada procesador
        for (const processor of processors) {
            if (processor.process) {
                processor.process.remainingTime -= 1; // Ejecutar un ciclo
                if (processor.process.remainingTime <= 0) {
                    processor.process.completionTime = time + 1;
                    completedProcesses.push(processor.process);
                    processor.process = null; // Liberar el procesador
                }
            }
        }

        // Visualizar el estado actual (opcional)
        visualizeState(time, processors, readyQueue, completedProcesses);

        time += 1; // Incrementar tiempo
    }

    return completedProcesses;
}

/**
 * Función para obtener el siguiente proceso (FIFO como ejemplo)
 */
const fifoAlgorithm: SchedulingAlgorithm = (queue) => {
    return queue.length > 0 ? queue[0] : null;
};

/**
 * Función para visualizar el estado actual
 */
function visualizeState(
    time: number,
    processors: Processor[],
    readyQueue: Process[],
    completedProcesses: Process[]
): void {
    console.log(`Time: ${time}`);
    console.log("Processors:", processors.map((p) => (p.process ? `P${p.process.id}` : "Idle")));
    console.log("Ready Queue:", readyQueue.map((p) => `P${p.id}`));
    console.log("Completed Processes:", completedProcesses.map((p) => `P${p.id}`));
    console.log("--------------------------------------------------");
}

// Ejemplo de uso
const processes: Process[] = [
    { id: 1, arrivalTime: 0, burstTime: 4, remainingTime: 4 },
    { id: 2, arrivalTime: 1, burstTime: 3, remainingTime: 3 },
    { id: 3, arrivalTime: 2, burstTime: 2, remainingTime: 2 },
    { id: 4, arrivalTime: 3, burstTime: 1, remainingTime: 1 },
];

const completed = symmetricScheduler(processes, 2, fifoAlgorithm);

console.log("Procesos completados:", completed);
