"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useIncidents } from "./useIncidents";

export function useIncidentAlerts() {
  const { data: incidents } = useIncidents();
  const known = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!incidents) return;

    incidents.forEach((incident) => {
      // already seen - ignore
      if (known.current.has(incident.id)) return;

      // new incident - alert
      known.current.add(incident.id);

      toast.error("New Incident Detected", {
        description: incident.title,
        duration: 6000,
      });
    });
  }, [incidents]);
}