"use client";

import { useEffect, useState } from "react";
import { SystemHealth } from "../utils/getSystemStatus";

export default function StatusHeader({ health }: { health: SystemHealth }) {
  const [lastUpdate, setLastUpdate] = useState(0);

  // Update timestamp whenever health changes
  useEffect(() => {
    setLastUpdate(0);
    const interval = setInterval(() => {
      setLastUpdate((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [health.status, health.affected.length]);

  const statusConfig = {
    healthy: {
      color: "bg-green-500",
      text: "System Operational",
      animation: "",
    },
    degraded: {
      color: "bg-amber-500",
      text: "System Degraded",
      animation: "animate-breathe",
    },
    outage: {
      color: "bg-red-500",
      text: "System Outage",
      animation: "animate-heartbeat",
    },
  };

  const config = statusConfig[health.status];
  const affectedCount = health.affected.length;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="flex items-center gap-4 py-6">
      {/* Large status indicator circle */}
      <div className="relative flex items-center justify-center">
        <div
          className={`h-12 w-12 rounded-full ${config.color} ${config.animation}`}
        />
      </div>

      {/* Status text and metadata */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{config.text}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {affectedCount > 0 && (
            <>
              <span>
                {affectedCount} {affectedCount === 1 ? "service" : "services"} affected
              </span>
              <span>•</span>
            </>
          )}
          <span>updated {formatTime(lastUpdate)}</span>
        </div>
      </div>
    </div>
  );
}
