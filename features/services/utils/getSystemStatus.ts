import { Service } from "../types";

export type SystemHealth = {
  status: "healthy" | "degraded" | "outage";
  affected: Service[];
};

export function getSystemStatus(services: Service[]): SystemHealth {
  const outages = services.filter(s => s.status === "outage");
  const degraded = services.filter(s => s.status === "degraded");

  if (outages.length > 0) {
    return { status: "outage", affected: outages };
  }

  if (degraded.length > 0) {
    return { status: "degraded", affected: degraded };
  }

  return { status: "healthy", affected: [] };
}