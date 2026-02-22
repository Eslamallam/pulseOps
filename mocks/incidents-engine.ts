import { Service } from "@/features/services/types";
import { Incident } from "@/features/incidents/types";

let activeIncidents: Incident[] = [];

export function evaluateIncidents(services: Service[]): Incident[] {
  services.forEach(service => {

    const existing = activeIncidents.find(i => i.serviceId === service.id);

    // create incident
    if (service.errorRate > 5 && !existing) {
      activeIncidents.push({
        id: crypto.randomUUID(),
        serviceId: service.id,
        title: `${service.name} experiencing high failure rate`,
        severity: service.errorRate > 10 ? "critical" : "major",
        status: "investigating",
        startedAt: new Date().toISOString(),
      });
    }

    // auto resolve
    if (service.errorRate < 2 && existing) {
      activeIncidents = activeIncidents.filter(i => i.serviceId !== service.id);
    }
  });

  return activeIncidents;
}