"use client";

import { useEffect, useRef, useState } from "react";
import { SystemHealth } from "../utils/getSystemStatus";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "@/components/ui/tooltip";

type HealthSnapshot = {
  status: "healthy" | "degraded" | "outage";
  timestamp: number;
};

const MAX_HISTORY = 30; // 30 ticks for 30-second window

export default function ActivityStrip({ health }: { health: SystemHealth }) {
  const [history, setHistory] = useState<HealthSnapshot[]>([]);
  const prevHealthRef = useRef<SystemHealth | null>(null);

  // Track health changes (new ticks)
  useEffect(() => {
    // Only add to history if health status or affected count changed (new tick)
    const hasChanged = 
      !prevHealthRef.current ||
      prevHealthRef.current.status !== health.status ||
      prevHealthRef.current.affected.length !== health.affected.length;

    if (hasChanged) {
      setHistory((prev) => {
        const newSnapshot: HealthSnapshot = {
          status: health.status,
          timestamp: Date.now(),
        };
        
        // Add new snapshot and limit to MAX_HISTORY
        const updated = [...prev, newSnapshot].slice(-MAX_HISTORY);
        return updated;
      });

      prevHealthRef.current = health;
    }
  }, [health]);

  const statusColors = {
    healthy: "bg-green-500",
    degraded: "bg-amber-500",
    outage: "bg-red-500",
  };

  const statusLabels = {
    healthy: "Healthy",
    degraded: "Degraded",
    outage: "Outage",
  };

  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-muted/30 border">
      <span className="text-xs text-muted-foreground font-medium">
        Last 30s:
      </span>
      <TooltipProvider delayDuration={100}>
        <div className="flex items-center gap-1 flex-1 overflow-hidden">
          {history.length === 0 && (
            <span className="text-xs text-muted-foreground">
              Waiting for data...
            </span>
          )}
          {history.map((snapshot, index) => (
            <Tooltip key={snapshot.timestamp}>
              <TooltipTrigger asChild>
                <div
                  className={`h-2 w-2 rounded-full ${statusColors[snapshot.status]} 
                    transition-all duration-300 ease-out animate-in fade-in slide-in-from-right-2 cursor-help`}
                  style={{
                    animationDelay: `${index * 20}ms`,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <TooltipArrow />
                {statusLabels[snapshot.status]} • {new Date(snapshot.timestamp).toLocaleTimeString()}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
