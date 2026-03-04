"use client";

import { useState, useEffect } from "react";

/**
 * Hook that returns a live-updating duration string from a given timestamp
 * Updates every second
 */
export function useIncidentDuration(startedAt: string) {
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const calculateDuration = () => {
      const now = new Date();
      const past = new Date(startedAt);
      const diffMs = now.getTime() - past.getTime();

      const seconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      const remainingHours = hours % 24;
      const remainingMinutes = minutes % 60;
      const remainingSeconds = seconds % 60;

      if (days > 0) {
        return `${days}d ${remainingHours}h ${remainingMinutes}m`;
      }
      if (hours > 0) {
        return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
      }
      if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      }
      return `${seconds}s`;
    };

    // Initial calculation
    setDuration(calculateDuration());

    // Update every second
    const interval = setInterval(() => {
      setDuration(calculateDuration());
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  return duration;
}
