"use client";

import PageContainer from "@/components/layout/page-container";
import ServiceSummaryPanel from "@/features/services/components/ServiceSummaryPanel";
import ServiceHealthTable from "@/features/services/components/ServiceHealthTable";
import { useServices } from "@/features/services/hooks/useServices";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesPage() {
  const { data: services, isLoading, isError } = useServices();

  return (
    <PageContainer title="Services">
      {isLoading && (
        <>
          {/* Summary Panel Loading */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          
          {/* Table Loading */}
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </>
      )}

      {services && services.length > 0 && (
        <>
          <ServiceSummaryPanel services={services} />
          <ServiceHealthTable services={services} />
        </>
      )}

      {isError && (
        <p className="text-red-500 mt-4">
          Failed to load services. Retrying automatically...
        </p>
      )}
    </PageContainer>
  );
}