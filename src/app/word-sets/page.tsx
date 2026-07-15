import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export default function WordSetsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Vocabulary"
        title="Word Sets"
        description="Browse curated vocabulary sets by topic, difficulty, and learning goal."
      />
      <EmptyState
        title="Word sets are coming soon"
        description="Curated sets will appear here with word counts, difficulty, and links to start training."
      />
    </>
  );
}
