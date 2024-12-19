import { ShortestJobFirst } from "../ShortestJobFirst/ShortestJobFirst";
import { FirstComeFirstServe } from "../FirstComeFirstServe/FirstComeFirstServe";
import { RoundRobin } from "../RoundRobin/RoundRobin";

// Lista de algoritmos disponibles
export const  algoritmos = [
    { Component: FirstComeFirstServe, name: "First Come First Serve" },
    { Component: RoundRobin, name: "Round Robin" },
    { Component: ShortestJobFirst, name: "Shortest Job First" },
  ];
