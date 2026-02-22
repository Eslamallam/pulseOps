"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Service } from "../types";

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

export default function ServiceCard({ service }: { service: Service }) {
  const status = statusConfig(service.status);

  return (
    <Link href={`/services/${service.id}`} className="block">
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base font-semibold">
            {service.name}
          </CardTitle>

          <Badge variant="outline" className={status.className}>
            {status.label}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Error Rate (Most Important Metric) */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              Error rate
            </span>

            <span className={`text-lg font-semibold ${errorRateColor(service.errorRate)}`}>
              {service.errorRate.toFixed(2)}%
            </span>
          </div>

          {/* Latency */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              Latency
            </span>

            <span className="font-medium">
              {service.avgLatencyMs} ms
            </span>
          </div>

          {/* Uptime */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              24h uptime
            </span>

            <span className="font-medium">
              {service.uptime24h.toFixed(2)}%
            </span>
          </div>

        </CardContent>
      </Card>
    </Link>
  );
}