import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title="Dashboard"
        description="Track learned words, accuracy, daily goals, active sets, hard words, and recent sessions."
      />
      <EmptyState
        title="No progress yet"
        description="Complete training sessions to see progress, accuracy, and difficult words here."
      />
    </>
  );
}
