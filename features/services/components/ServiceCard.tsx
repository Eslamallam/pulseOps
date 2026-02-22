"use client";

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

export default function ServiceCard({ service }: { service: Service }) {
  const status = statusConfig(service.status);

  const prevError = usePrevious(service.errorRate);
  const increasing = prevError && service.errorRate > prevError;

  return (
    <Link href={`/services/${service.id}`} className="block">
      <Card
        className={`cursor-pointer hover:shadow-md transition-all duration-300
          ${service.status !== "healthy" ? "animate-pulse border-red-400/40" : ""}
        `}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <StatusIcon status={service.status} />
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

            <AnimatedNumber value={service.errorRate} decimals={2} suffix="%" />
            {prevError !== undefined && (
              <span
                className={`text-xs ${increasing ? "text-red-500" : "text-green-500"}`}
              >
                {increasing ? "▲ increasing" : "▼ recovering"}
              </span>
            )}
          </div>

          {/* Latency */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Latency</span>

            <AnimatedNumber value={service.avgLatencyMs} suffix=" ms" />
          </div>

          {/* Uptime */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">24h uptime</span>

            <AnimatedNumber value={service.uptime24h} decimals={2} suffix="%" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
