import PageContainer from "@/components/layout/page-container";
import { EventStreamViewer } from "@/features/explorer/components/EventStreamViewer";

export default function ExplorerPage() {
  return (
    <PageContainer title="Explorer">
      <EventStreamViewer />
    </PageContainer>
  );
}