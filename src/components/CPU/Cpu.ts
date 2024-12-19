import { Process } from "../../interfaces/Process";
import React,{ ReactNode } from "react";



export class CPU {
  private tiempoEjecucionAcumulado: number;
  private queue: Process[];
  private algoritmo: React.FC<any>;

  constructor(indiceAlgo: number, algoritmos: { Component: React.FC<any>; name: string }[]) {
    this.tiempoEjecucionAcumulado = 0;
    this.queue = [];
    this.algoritmo = algoritmos[indiceAlgo].Component;
  }

  addProceso(process: Process): void {
    this.queue.push(process);
  }

  runScheduler(opciones?: any): ReactNode {
    console.log("Ejecutando algoritmo de planificación...");
    
    return React.createElement(this.algoritmo, {
      procesos: this.queue,
      tiempo: 0,
      opciones: opciones,
    });
    
  }
}
