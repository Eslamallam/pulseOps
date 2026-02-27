"use client";

import PageContainer from "@/components/layout/page-container";

import StatusHeader from "@/features/services/components/StatusHeader";
import ActivityStrip from "@/features/services/components/ActivityStrip";
import ServiceCard from "@/features/services/components/ServiceCard";
import ServiceCardSkeleton from "@/features/services/components/ServiceCardSkeleton";

import { useServices } from "@/features/services/hooks/useServices";
import { getSystemStatus } from "@/features/services/utils/getSystemStatus";

import { useIncidents } from "@/features/incidents/hooks/useIncidents";
import IncidentRow from "@/features/incidents/components/IncidentRow";

import { Service } from "@/features/services/types";

export default function OverviewPage() {
  const { data: services, isLoading, isError } = useServices();
  const { data: incidents } = useIncidents();

  // derive global system health
 const health = services ? getSystemStatus(services) : { status: "healthy" as const, affected: [] };

  return (
    <PageContainer title="Overview">

      {/* 1️⃣ System Status Header */}
      <StatusHeader health={health} />

      {/* 2️⃣ Activity Strip - Recent System Behavior */}
      <div className="mt-6">
        <ActivityStrip health={health} />
      </div>

      {/* 3️⃣ Services Grid - Component Health */}
      <section className="space-y-4 mt-8">
        <h2 className="text-lg font-semibold">Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* Loading skeletons */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}

          {/* Real services */}
          {services?.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}

        </div>

        {/* Network failure message */}
        {isError && (
          <p className="text-sm text-red-500">
            Failed to load services. Retrying automatically...
          </p>
        )}
      </section>

      {/* 4️⃣ Active Incidents */}
      <section className="space-y-4 mt-8">
        <h2 className="text-lg font-semibold">Active Incidents</h2>

        {incidents?.length === 0 && (
          <div className="rounded-lg border p-8 text-center bg-card">
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
      </section>

    </PageContainer>
  );
}