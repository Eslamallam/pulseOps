"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Service } from "../types";

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  Clock3,
  Percent,
} from "lucide-react";
import AnimatedNumber from "@/components/ui/animated-number";
import { usePrevious } from "../hooks/usePrevious";

/* Status styling */
function statusConfig(status: Service["status"]) {
  switch (status) {
    case "healthy":
      return {
        label: "Operational",
        className: "bg-green-500/10 text-green-600 border-green-500/20",
      };
    case "degraded":
      return {
        label: "Degraded",
        className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      };
    case "outage":
      return {
        label: "Outage",
        className: "bg-red-500/10 text-red-600 border-red-500/20",
      };
  }
}

/* Emphasize dangerous error rates */
function errorRateColor(rate: number) {
  if (rate > 10) return "text-red-600";
  if (rate > 3) return "text-yellow-600";
  return "text-foreground";
}

function StatusIcon({ status }: { status: Service["status"] }) {
  if (status === "healthy")
    return <CheckCircle2 className="h-4 w-4 text-green-600" />;

  if (status === "degraded")
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;

  return <XCircle className="h-4 w-4 text-red-600" />;
}

/* Vital sign pulse indicator */
function PulseIndicator({ status }: { status: Service["status"] }) {
  const config = {
    healthy: {
      color: "bg-green-500",
      animation: "",
    },
    degraded: {
      color: "bg-amber-500",
      animation: "animate-pulse-slow",
    },
    outage: {
      color: "bg-red-500",
      animation: "animate-pulse-fast",
    },
  };

  const { color, animation } = config[status];

  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${color} ${animation}`}
      aria-label={`${status} status indicator`}
    />
  );
}

/* Trend indicator for metrics */
function TrendIndicator({ 
  current, 
  previous, 
  higherIsBetter = false,
  threshold = 0.01
}: { 
  current: number; 
  previous: number | undefined;
  higherIsBetter?: boolean;
  threshold?: number;
}) {
  if (previous === undefined) return null;

  const diff = current - previous;
  const isStable = Math.abs(diff) < threshold;

  if (isStable) {
    return (
      <span className="text-xs text-muted-foreground ml-1">
        — stable
      </span>
    );
  }

  const isIncreasing = diff > 0;
  const isImproving = higherIsBetter ? isIncreasing : !isIncreasing;

  if (isImproving) {
    return (
      <span className="text-xs text-green-500 ml-1">
        ▼ {higherIsBetter ? "improving" : "recovering"}
      </span>
    );
  }

  return (
    <span className="text-xs text-red-500 ml-1">
      ▲ {isIncreasing ? "rising" : "dropping"}
    </span>
  );
}

export default function ServiceCard({ service }: { service: Service }) {
  const status = statusConfig(service.status);

  // Track previous values for trend detection
  const prevError = usePrevious(service.errorRate);
  const prevLatency = usePrevious(service.avgLatencyMs);
  const prevUptime = usePrevious(service.uptime24h);
  const prevStatus = usePrevious(service.status);

  // Status change highlight
  const [statusChanged, setStatusChanged] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (prevStatus && prevStatus !== service.status) {
      setStatusChanged(true);
      const timer = setTimeout(() => setStatusChanged(false), 400);
      return () => clearTimeout(timer);
    }
  }, [service.status, prevStatus]);

  // Border glow for issues
  const borderGlow = service.status === "outage" 
    ? "border-red-500/20 [color:rgba(239,68,68,0.25)]" 
    : service.status === "degraded" 
    ? "border-amber-500/20 [color:rgba(245,158,11,0.25)]" 
    : "";

  return (
    <Link href={`/services/${service.id}`} className="block group">
      <Card
        className={`cursor-pointer hover:shadow-md transition-all duration-300 relative
          ${borderGlow && `${borderGlow} animate-glow-border`}
          ${statusChanged ? "animate-highlight" : ""}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hover overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none transition-opacity duration-200 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">View details →</span>
          </div>
        )}

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <PulseIndicator status={service.status} />
            {service.name}
          </CardTitle>

          <Badge variant="outline" className={status.className}>
            {status.label}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Rate (Most Important Metric) */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Error rate</span>
            <div className="flex items-baseline gap-1">
              <AnimatedNumber value={service.errorRate} decimals={2} suffix="%" />
              <TrendIndicator 
                current={service.errorRate} 
                previous={prevError}
                threshold={0.1}
              />
            </div>
          </div>

          {/* Latency */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Latency</span>
            <div className="flex items-baseline gap-1">
              <AnimatedNumber value={service.avgLatencyMs} suffix=" ms" />
              <TrendIndicator 
                current={service.avgLatencyMs} 
                previous={prevLatency}
                threshold={5}
              />
            </div>
          </div>

          {/* Uptime */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">24h uptime</span>
            <div className="flex items-baseline gap-1">
              <AnimatedNumber value={service.uptime24h} decimals={2} suffix="%" />
              <TrendIndicator 
                current={service.uptime24h} 
                previous={prevUptime}
                higherIsBetter={true}
                threshold={0.05}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
