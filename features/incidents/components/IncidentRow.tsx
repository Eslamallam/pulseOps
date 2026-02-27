"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Incident } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useServices } from "@/features/services/hooks/useServices";

function severityBarColor(severity: Incident["severity"]) {
  switch (severity) {
    case "critical":
      return "bg-red-500";
    case "major":
      return "bg-orange-500";
    case "minor":
      return "bg-yellow-500";
  }
}

function severityBadgeColor(severity: Incident["severity"]) {
  switch (severity) {
    case "critical":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    case "major":
      return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    case "minor":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  }
}

function LiveDuration({ startedAt }: { startedAt: string }) {
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const updateDuration = () => {
      const start = new Date(startedAt).getTime();
      const now = Date.now();
      const diffSeconds = Math.floor((now - start) / 1000);

      const minutes = Math.floor(diffSeconds / 60);
      const seconds = diffSeconds % 60;

      if (minutes > 0) {
        setDuration(`${minutes}m ${seconds}s ago`);
      } else {
        setDuration(`${seconds}s ago`);
      }
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  return <span className="font-mono text-sm text-muted-foreground">Started {duration}</span>;
}

export default function IncidentRow({ incident }: { incident: Incident }) {
  const { data: services } = useServices();
  const affectedService = services?.find((s) => s.id === incident.serviceId);
  
  // Flash animation when created
  const [isNew, setIsNew] = useState(true);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      const timer = setTimeout(() => setIsNew(false), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div 
      className={`flex items-center gap-0 rounded-lg border overflow-hidden hover:shadow-md transition-all duration-300 bg-card relative
        ${isNew ? "animate-flash" : ""}
      `}
    >
      {/* Severity color bar */}
      <div className={`w-1 h-20 flex-shrink-0 ${severityBarColor(incident.severity)}`} />

      {/* Main content */}
      <div className="flex items-center justify-between flex-1 px-4 py-3">
        <div className="flex flex-col gap-1 flex-1">
          {/* Title and severity */}
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base">{incident.title}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-md border ${severityBadgeColor(
                incident.severity
              )}`}
            >
              {incident.severity.toUpperCase()}
            </span>
          </div>

          {/* Duration and affected service */}
          <div className="flex items-center gap-3 text-sm">
            <LiveDuration startedAt={incident.startedAt} />
            {affectedService && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  Affecting <span className="font-medium text-foreground">{affectedService.name}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action button */}
        <Link href={`/incidents/${incident.id}`}>
          <Button variant="outline" size="sm" className="gap-1">
            Investigate
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}