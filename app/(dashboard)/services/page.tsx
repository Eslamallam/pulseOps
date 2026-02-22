"use client";

import PageContainer from "@/components/layout/page-container";
import ServiceCard from "@/features/services/components/ServiceCard";
import ServiceCardSkeleton from "@/features/services/components/ServiceCardSkeleton";
import { useServices } from "@/features/services/hooks/useServices";
import { Service } from "@/features/services/types";

export default function ServicesPage() {
  const { data: services, isLoading, isError } = useServices();

  return (
    <PageContainer title="Services">

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}

        {services?.map((service: Service) => (
          <ServiceCard key={service.id} service={service} />
        ))}

      </div>

      {isError && (
        <p className="text-red-500 mt-4">
          Failed to load services. Retrying automatically...
        </p>
      )}

    </PageContainer>
  );
}