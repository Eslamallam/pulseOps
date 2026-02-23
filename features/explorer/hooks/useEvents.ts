"use client";

import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../api/getEvents";

/**
 * React Query hook for fetching events
 * 
 * Events are independent from services and incidents.
 * No invalidation happens from other domains.
 * 
 * Polls every 4 seconds to get latest events from the store.
 */
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
    placeholderData: (previousData) => previousData, // Keep previous data during refetch
    staleTime: 0,
  });
}
