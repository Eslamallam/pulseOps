"use client";

import { useParams } from "next/navigation";
import PageContainer from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { useIncidentDetails } from "@/features/incidents/hooks/useIncidentDetails";
import { useIncidentDuration } from "@/features/incidents/hooks/useIncidentDuration";
import IncidentTimeline from "@/features/incidents/components/IncidentTimeline";
import { 
  getSeverityBorderColor, 
  getSeverityBadgeVariant, 
  getTimeAgo, 
  capitalize 
} from "@/features/incidents/utils/incidentHelpers";
import { cn } from "@/lib/utils";

export default function IncidentDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useIncidentDetails(id);
  
  // Call hook unconditionally - use current time as fallback to avoid breaking Rules of Hooks
  const duration = useIncidentDuration(data?.incident?.startedAt || new Date().toISOString());

  if (isLoading) return <PageContainer title="Incident">Loading...</PageContainer>;
  if (!data) return <PageContainer title="Incident">Not found</PageContainer>;

  const { incident, service, events } = data;

  return (
    <PageContainer title="Incident Details">
      {/* Incident Header with colored left border */}
      <div 
        className={cn(
          "rounded-lg border border-l-4 p-6 mb-6 bg-card",
          getSeverityBorderColor(incident.severity)
        )}
      >
        {/* Title with Severity Badge */}
        <div className="flex items-start gap-3 mb-4">
          <Badge 
            variant={getSeverityBadgeVariant(incident.severity) as any}
            className="mt-1"
          >
            {capitalize(incident.severity)}
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">
            {incident.title}
          </h1>
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">Service:</span>{" "}
            {service?.name || "Unknown"}
          </div>
          <div>
            <span className="font-medium text-foreground">Status:</span>{" "}
            {capitalize(incident.status)}
          </div>
          <div>
            <span className="font-medium text-foreground">Severity:</span>{" "}
            {capitalize(incident.severity)}
          </div>
          <div>
            <span className="font-medium text-foreground">Started:</span>{" "}
            {getTimeAgo(incident.startedAt)}
          </div>

        {/* Live Duration Timer */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium">
              Incident active for {duration}
            </span>
          </div>
        </div>
        </div>
      </div>

      <IncidentTimeline events={events} />

    </PageContainer>
  );
}