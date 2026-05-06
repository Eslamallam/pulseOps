import { Suspense } from "react";
import PageContainer from "@/components/layout/page-container";
import { EventStreamViewer } from "@/features/explorer/components/EventStreamViewer";

export default function ExplorerPage() {
  return (
    <PageContainer title="Explorer">
      <Suspense fallback={
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          Loading event stream...
        </div>
      }>
        <EventStreamViewer />
      </Suspense>
    </PageContainer>
  );
}