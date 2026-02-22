"use client";

import { useParams } from "next/navigation";
import PageContainer from "@/components/layout/page-container";
import { useIncidentDetails } from "@/features/incidents/hooks/useIncidentDetails";
import IncidentTimeline from "@/features/incidents/components/IncidentTimeline";

export default function IncidentDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useIncidentDetails(id);

  if (isLoading) return <PageContainer title="Incident">Loading...</PageContainer>;
  if (!data) return <PageContainer title="Incident">Not found</PageContainer>;

  const { incident, events } = data;

  return (
    <PageContainer title={incident.title}>

      <div className="rounded-lg border p-6 mb-6">
        <p className="text-sm text-muted-foreground mb-2">
          Severity: <span className="font-medium">{incident.severity}</span>
        </p>

        <p className="text-sm text-muted-foreground">
          Status: <span className="font-medium">{incident.status}</span>
        </p>
      </div>

      <IncidentTimeline events={events} />

    </PageContainer>
  );
}