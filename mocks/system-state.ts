import { Service } from "@/features/services/types";
import { services as baseServices } from "./services";
import { evaluateIncidents } from "./incidents-engine";

let currentState: Service[] = structuredClone(baseServices);

// ---- simulation engine ----

const FAILURE_CHANCE = 0.18;
const RECOVERY_CHANCE = 0.25;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function tick() {
  currentState = currentState.map(service => {
    let next = { ...service };

    // recovery
    if (service.status !== "healthy" && Math.random() < RECOVERY_CHANCE) {
      next.status = "healthy";
      next.errorRate = randomBetween(0, 0.4);
      next.avgLatencyMs = randomBetween(80, 250);
      next.uptime24h = Math.min(99.99, service.uptime24h + 0.2);
      return next;
    }

    // failure
    if (service.status === "healthy" && Math.random() < FAILURE_CHANCE) {
      const critical = Math.random() < 0.4;

      next.status = critical ? "outage" : "degraded";
      next.errorRate = critical ? randomBetween(8, 18) : randomBetween(2, 6);
      next.avgLatencyMs = critical ? randomBetween(900, 1600) : randomBetween(400, 900);
      next.uptime24h -= randomBetween(1, 4);
      return next;
    }

    // fluctuation
    next.errorRate = Math.max(0, next.errorRate + randomBetween(-0.3, 0.3));
    next.avgLatencyMs = Math.max(50, next.avgLatencyMs + randomBetween(-40, 40));

    return next;
  });

  // evaluate incidents ONCE
  evaluateIncidents(currentState);
}

// 🔥 THE IMPORTANT PART
// run simulation every 8 seconds (backend clock)
setInterval(tick, 8000);

// ---- API access ----

export function getSystemState(): Service[] {
  return structuredClone(currentState);
}