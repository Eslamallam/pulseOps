"use client";

import { useQuery } from "@tanstack/react-query";
import { getIncidents } from "../api/getIncidents";

export function useIncidents() {
  return useQuery({
    queryKey: ["incidents"],
    queryFn: getIncidents,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });
}