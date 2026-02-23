import { Service } from "@/features/services/types";
import { services as baseServices } from "./services";
import { evaluateIncidents } from "./incidents-engine";
import { addEvent } from "./event-store";
import { Event } from "@/features/explorer/types";

let currentState: Service[] = structuredClone(baseServices);
let previousState: Service[] = structuredClone(baseServices);

// ---- simulation engine ----

const FAILURE_CHANCE = 0.18;
const RECOVERY_CHANCE = 0.25;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function generateEvent(
  service: Service,
  level: Event["level"],
  message: string,
  metadata?: Record<string, any>
): void {
  addEvent({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    service: service.name as Event["service"],
    level,
    message,
    metadata,
  });
}

function tick() {
  // Store previous state before updates
  previousState = structuredClone(currentState);

  currentState = currentState.map(service => {
    let next = { ...service };
    const prevService = previousState.find(s => s.id === service.id)!;

    // recovery
    if (service.status !== "healthy" && Math.random() < RECOVERY_CHANCE) {
      next.status = "healthy";
      next.errorRate = randomBetween(0, 0.4);
      next.avgLatencyMs = randomBetween(80, 250);
      next.uptime24h = Math.min(99.99, service.uptime24h + 0.2);
      
      // Generate recovery event
      generateEvent(next, "info", "Provider responding normally", {
        previousStatus: service.status,
        recoveredAt: new Date().toISOString(),
      });
      
      return next;
    }

    // failure
    if (service.status === "healthy" && Math.random() < FAILURE_CHANCE) {
      const critical = Math.random() < 0.4;

      next.status = critical ? "outage" : "degraded";
      next.errorRate = critical ? randomBetween(8, 18) : randomBetween(2, 6);
      next.avgLatencyMs = critical ? randomBetween(900, 1600) : randomBetween(400, 900);
      next.uptime24h -= randomBetween(1, 4);
      
      // Generate failure event
      if (critical) {
        const errorMessages = [
          "Provider 500 error",
          "Timeout contacting provider",
        ];
        generateEvent(next, "error", errorMessages[Math.floor(Math.random() * errorMessages.length)], {
          errorRate: next.errorRate.toFixed(2) + "%",
          latency: Math.round(next.avgLatencyMs) + "ms",
        });
      } else {
        const warnMessages = [
          "Provider latency increased",
          "Retry scheduled",
        ];
        generateEvent(next, "warn", warnMessages[Math.floor(Math.random() * warnMessages.length)], {
          latency: Math.round(next.avgLatencyMs) + "ms",
        });
      }
      
      return next;
    }

    // fluctuation
    next.errorRate = Math.max(0, next.errorRate + randomBetween(-0.3, 0.3));
    next.avgLatencyMs = Math.max(50, next.avgLatencyMs + randomBetween(-40, 40));

    // Generate events based on current status
    if (next.status === "healthy" && Math.random() < 0.3) {
      // Occasionally produce info events for healthy services
      const infoMessages = [
        "Message delivered",
        "Message accepted",
      ];
      generateEvent(next, "info", infoMessages[Math.floor(Math.random() * infoMessages.length)], {
        latency: Math.round(next.avgLatencyMs) + "ms",
      });
    } else if (next.status === "degraded" && Math.random() < 0.5) {
      // Produce warn events for degraded services
      const warnMessages = [
        "Provider latency increased",
        "Retry scheduled",
      ];
      generateEvent(next, "warn", warnMessages[Math.floor(Math.random() * warnMessages.length)], {
        errorRate: next.errorRate.toFixed(2) + "%",
        latency: Math.round(next.avgLatencyMs) + "ms",
      });
    } else if (next.status === "outage" && Math.random() < 0.6) {
      // Produce error events for outage services
      const errorMessages = [
        "Provider 500 error",
        "Timeout contacting provider",
      ];
      generateEvent(next, "error", errorMessages[Math.floor(Math.random() * errorMessages.length)], {
        errorRate: next.errorRate.toFixed(2) + "%",
        latency: Math.round(next.avgLatencyMs) + "ms",
      });
    }

    // Check for high error rate
    if (next.errorRate > 5 && Math.random() < 0.4) {
      generateEvent(next, "warn", "Retry queue increasing", {
        errorRate: next.errorRate.toFixed(2) + "%",
        queueDepth: Math.floor(next.errorRate * 100),
      });
    }

    // Webhook Dispatcher specific check
    if (next.name === "Webhook Dispatcher" && next.avgLatencyMs > 900 && Math.random() < 0.4) {
      generateEvent(next, "error", "Webhook timeout", {
        latency: Math.round(next.avgLatencyMs) + "ms",
        threshold: "900ms",
      });
    }

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