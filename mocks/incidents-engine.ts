import { Service } from "@/features/services/types";
import { Incident } from "@/features/incidents/types";

let activeIncidents: Incident[] = [];

export function evaluateIncidents(services: Service[]): Incident[] {
  services.forEach(service => {

    const existing = activeIncidents.find(i => i.serviceId === service.id);

    // CREATE incident
    if (service.status !== "healthy" && !existing) {
      activeIncidents.push({
        id: crypto.randomUUID(),
        serviceId: service.id,
        title: `${service.name} experiencing delivery failures`,
        severity: service.status === "outage" ? "critical" : "major",
        status: "investigating",
        startedAt: new Date().toISOString(),
      });
    }

    // UPDATE incident severity when service status changes
    if (service.status !== "healthy" && existing) {
      const updatedSeverity = service.status === "outage" ? "critical" : "major";
      if (existing.severity !== updatedSeverity) {
        existing.severity = updatedSeverity;
      }
    }

    // RESOLVE incident
    if (service.status === "healthy" && existing) {
      activeIncidents = activeIncidents.filter(i => i.serviceId !== service.id);
    }
  });

  return activeIncidents;
}

export function getActiveIncidents() {
  return activeIncidents;
}