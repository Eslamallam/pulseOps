"use client";

import PageContainer from "@/components/layout/page-container";
import { useIncidents } from "@/features/incidents/hooks/useIncidents";
import IncidentRow from "@/features/incidents/components/IncidentRow";

export default function IncidentsPage() {
  const { data: incidents, isLoading } = useIncidents();

  return (
    <PageContainer title="Incidents">

      {isLoading && (
        <p className="text-muted-foreground">Loading incidents...</p>
      )}

      {incidents?.length === 0 && (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            No active incidents 🎉
          </p>
        </div>
      )}

      <div className="space-y-3">
        {incidents?.map((incident) => (
          <IncidentRow key={incident.id} incident={incident} />
        ))}
      </div>

    </PageContainer>
  );
}