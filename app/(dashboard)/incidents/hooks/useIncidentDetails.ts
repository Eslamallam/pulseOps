"use client";

import { useQuery } from "@tanstack/react-query";
import { useIncidents } from "@/features/incidents/hooks/useIncidents";
import { generateIncidentEvents } from "@/mocks/events";

export function useIncidentDetails(id: string) {
  const { data: incidents } = useIncidents();

  return useQuery({
    queryKey: ["incident-details", id],
    enabled: !!incidents,
    queryFn: async () => {
      const incident = incidents?.find(i => i.id === id);
      if (!incident) return null;

      await new Promise(res => setTimeout(res, 500));

      return {
        incident,
        events: generateIncidentEvents(incident),
      };
    },
  });
}