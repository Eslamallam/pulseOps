import { Incident } from "@/features/incidents/types";

export function generateIncidentEvents(incident: Incident) {
  const start = new Date(incident.startedAt).getTime();

  return [
    {
      id: crypto.randomUUID(),
      message: "Error rate exceeded normal threshold",
      time: new Date(start - 8 * 60 * 1000),
    },
    {
      id: crypto.randomUUID(),
      message: "Provider responding slowly",
      time: new Date(start - 5 * 60 * 1000),
    },
    {
      id: crypto.randomUUID(),
      message: "Retry queue increasing",
      time: new Date(start - 3 * 60 * 1000),
    },
    {
      id: crypto.randomUUID(),
      message: "System marked as degraded",
      time: new Date(start - 1 * 60 * 1000),
    },
  ];
}