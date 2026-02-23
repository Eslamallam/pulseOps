"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getServices } from "../api/getServices";
import { Service } from "../types";

export function useServices() {
  const queryClient = useQueryClient();

  const query = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: getServices,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    retry: 2,
    refetchOnWindowFocus: true,
  });

  // v5 way — react to data change
  useEffect(() => {
    if (!query.data) return;

    // whenever services update → refresh incidents immediately
    queryClient.refetchQueries({
      queryKey: ["incidents"],
    });

  }, [query.data, queryClient]);

  return query;
}