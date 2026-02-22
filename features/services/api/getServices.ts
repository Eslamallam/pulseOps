import { services } from "@/mocks/services";
import { Service } from "../types";

import { evaluateIncidents } from "@/mocks/incidents-engine";

function fluctuate(value: number, range: number) {
  const change = (Math.random() - 0.5) * range;
  return Math.max(0, value + change);
}

export async function getServices(): Promise<Service[]> {
  await new Promise((res) => setTimeout(res, 700));

  if (Math.random() < 0.1) {
    throw new Error("Network error");
  }

  // simulate real monitoring metrics
  const updatedServices = services.map((s) => ({
    ...s,
    avgLatencyMs: Math.round(fluctuate(s.avgLatencyMs, 80)),
    errorRate: Number(fluctuate(s.errorRate, 1).toFixed(2)),
  }));

  evaluateIncidents(updatedServices);

  return updatedServices;
}