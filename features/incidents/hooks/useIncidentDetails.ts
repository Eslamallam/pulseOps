"use client";

import { useQuery } from "@tanstack/react-query";
import { useIncidents } from "./useIncidents";
import { useServices } from "@/features/services/hooks/useServices";
import { generateIncidentEvents } from "@/mocks/events";

export function useIncidentDetails(id: string) {
  const { data: incidents } = useIncidents();
  const { data: services } = useServices();

  return useQuery({
    queryKey: ["incident-details", id],
    enabled: !!incidents && !!services,
    queryFn: async () => {
      const incident = incidents?.find(i => i.id === id);
      if (!incident) return null;

      const service = services?.find(s => s.id === incident.serviceId);

      await new Promise(res => setTimeout(res, 500));

      return {
        incident,
        service,
        events: generateIncidentEvents(incident),
      };
    },
  });
}