"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Service } from "../types";
import { Incident } from "@/features/incidents/types";
import { usePrevious } from "../hooks/usePrevious";
import { useIncidents } from "@/features/incidents/hooks/useIncidents";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { getTimeAgo, capitalize } from "@/features/incidents/utils/incidentHelpers";

type SortField = "status" | "errorRate" | "latency" | "uptime";
type SortDirection = "asc" | "desc";

/* Status badge styling */
function getStatusBadge(status: Service["status"]) {
  switch (status) {
    case "healthy":
      return {
        label: "Operational",
        className: "bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/30",
      };
    case "degraded":
      return {
        label: "Degraded",
        className: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border-amber-500/30",
      };
    case "outage":
      return {
        label: "Outage",
        className: "bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-500/30",
      };
  }
}

/* Trend indicator component */
function TrendIndicator({
  current,
  previous,
  higherIsBetter = false,
  threshold = 0.01,
}: {
  current: number;
  previous: number | undefined;
  higherIsBetter?: boolean;
  threshold?: number;
}) {
  if (previous === undefined) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const diff = current - previous;
  const isStable = Math.abs(diff) < threshold;

  if (isStable) {
    return <span className="text-xs text-muted-foreground">stable</span>;
  }

  const isIncreasing = diff > 0;
  const isImproving = higherIsBetter ? isIncreasing : !isIncreasing;

  if (isImproving) {
    return (
      <span className="text-xs text-green-600 flex items-center gap-1">
        <span>▼</span>
        <span>{higherIsBetter ? "improving" : "recovering"}</span>
      </span>
    );
  }

  return (
    <span className="text-xs text-red-600 flex items-center gap-1">
      <span>▲</span>
      <span>{isIncreasing ? "rising" : "dropping"}</span>
    </span>
  );
}

/* Expanded row content */
function ExpandedRowContent({ 
  service, 
  incidents 
}: { 
  service: Service; 
  incidents: Incident[] 
}) {
  const serviceIncidents = incidents.filter(i => i.serviceId === service.id);

  return (
    <TableRow>
      <TableCell colSpan={6} className="bg-muted/30 p-6">
        <div className="space-y-4">
          {/* Recent Incidents */}
          {serviceIncidents.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Recent Incidents</h4>
              {serviceIncidents.map((incident) => (
                <div key={incident.id} className="rounded-lg border bg-card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">{incident.title}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Status: {capitalize(incident.status)}</span>
                        <span>Severity: {capitalize(incident.severity)}</span>
                        <span>Started: {getTimeAgo(incident.startedAt)}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/incidents/${incident.id}`}
                      className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No recent incidents for this service
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-2 border-t">
            <Link 
              href={`/explorer?service=${encodeURIComponent(service.name)}&highlight=true`}
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="outline" size="sm" className="gap-2">
                View in Event Explorer
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

/* Individual service row */
function ServiceRow({ 
  service, 
  isExpanded, 
  onToggleExpand,
  incidents 
}: { 
  service: Service; 
  isExpanded: boolean;
  onToggleExpand: () => void;
  incidents: Incident[];
}) {
  const router = useRouter();
  const statusBadge = getStatusBadge(service.status);

  // Track previous values for trend detection
  const prevError = usePrevious(service.errorRate);
  const prevLatency = usePrevious(service.avgLatencyMs);
  const prevUptime = usePrevious(service.uptime24h);

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't expand if clicking on a link
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    onToggleExpand();
  };

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-muted/70 h-16"
        onClick={handleRowClick}
      >
        {/* Service Name with expand icon */}
        <TableCell className="font-medium text-base px-4">
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <div
              className={`h-2 w-2 rounded-full ${
                service.status === "healthy"
                  ? "bg-green-500"
                  : service.status === "degraded"
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
            />
            {service.name}
          </div>
        </TableCell>

      {/* Status */}
      <TableCell className="px-4">
        <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
      </TableCell>

      {/* Error Rate */}
      <TableCell className="text-base px-4">
        <span
          className={
            service.errorRate > 10
              ? "text-red-600 font-medium"
              : service.errorRate > 3
              ? "text-amber-600 font-medium"
              : ""
          }
        >
          {service.errorRate.toFixed(2)}%
        </span>
      </TableCell>

      {/* Latency */}
      <TableCell className="text-base px-4">
        <span
          className={
            service.avgLatencyMs > 1000
              ? "text-red-600 font-medium"
              : service.avgLatencyMs > 500
              ? "text-amber-600 font-medium"
              : ""
          }
        >
          {service.avgLatencyMs.toFixed(2)} ms
        </span>
      </TableCell>

      {/* 24h Uptime */}
      <TableCell className="text-base px-4">
        <span
          className={
            service.status === "outage"
              ? "text-red-600 font-medium"
              : service.uptime24h < 99
              ? "text-amber-600 font-medium"
              : "text-green-600"
          }
        >
          {service.uptime24h.toFixed(2)}%
        </span>
      </TableCell>

      {/* Trend Indicator */}
      <TableCell className="px-4">
        <div className="flex flex-col gap-1">
          <TrendIndicator
            current={service.errorRate}
            previous={prevError}
            higherIsBetter={false}
          />
        </div>
      </TableCell>
    </TableRow>
    
    {/* Expanded content */}
    {isExpanded && <ExpandedRowContent service={service} incidents={incidents} />}
    </>
  );
}

/* Main table component */
export default function ServiceHealthTable({
  services,
}: {
  services: Service[];
}) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  // Fetch incidents data
  const { data: incidents = [] } = useIncidents();

  // Handle column header clicks
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field - default to descending for error/latency, ascending for uptime
      setSortField(field);
      setSortDirection(field === "uptime" ? "asc" : "desc");
    }
  };

  // Toggle row expansion
  const handleToggleExpand = (serviceId: string) => {
    setExpandedServiceId(expandedServiceId === serviceId ? null : serviceId);
  };

  // Sort services
  const sortedServices = useMemo(() => {
    if (!sortField) return services;

    return [...services].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "status":
          // outage > degraded > healthy
          const statusOrder = { outage: 3, degraded: 2, healthy: 1 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case "errorRate":
          comparison = a.errorRate - b.errorRate;
          break;
        case "latency":
          comparison = a.avgLatencyMs - b.avgLatencyMs;
          break;
        case "uptime":
          comparison = a.uptime24h - b.uptime24h;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [services, sortField, sortDirection]);

  // Sort indicator component
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-muted/50">
            <TableHead className="w-[250px] text-base font-semibold h-14 px-4">
              Service Name
            </TableHead>
            <TableHead
              className="w-[150px] text-base font-semibold h-14 px-4 cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center">
                Status
                <SortIndicator field="status" />
              </div>
            </TableHead>
            <TableHead
              className="w-[130px] text-base font-semibold h-14 px-4 cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => handleSort("errorRate")}
            >
              <div className="flex items-center">
                Error Rate
                <SortIndicator field="errorRate" />
              </div>
            </TableHead>
            <TableHead
              className="w-[130px] text-base font-semibold h-14 px-4 cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => handleSort("latency")}
            >
              <div className="flex items-center">
                Latency
                <SortIndicator field="latency" />
              </div>
            </TableHead>
            <TableHead
              className="w-[130px] text-base font-semibold h-14 px-4 cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => handleSort("uptime")}
            >
              <div className="flex items-center">
                24h Uptime
                <SortIndicator field="uptime" />
              </div>
            </TableHead>
            <TableHead className="w-[160px] text-base font-semibold h-14 px-4">
              Trend
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedServices.map((service) => (
            <ServiceRow 
              key={service.id} 
              service={service}
              isExpanded={expandedServiceId === service.id}
              onToggleExpand={() => handleToggleExpand(service.id)}
              incidents={incidents}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
