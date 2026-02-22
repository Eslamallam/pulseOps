"use client";

import { useQuery } from "@tanstack/react-query";
import { getServices } from "../api/getServices";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,

    // refresh every 10s
    refetchInterval: 10000,

    // 🔴 THIS IS THE IMPORTANT LINE
    refetchIntervalInBackground: true,

    // treat data as stale quickly
    staleTime: 0,

    // retry failures
    retry: 2,

    // don't wait for window focus
    refetchOnWindowFocus: true,
  });
}