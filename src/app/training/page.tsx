import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export default function TrainingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Training"
        title="Training"
        description="Practice vocabulary through short focused exercises and review results after each session."
      />
      <EmptyState
        title="Choose a word set to begin"
        description="Training sessions will start from a selected vocabulary set and guide you through one question at a time."
      />
    </>
  );
}
