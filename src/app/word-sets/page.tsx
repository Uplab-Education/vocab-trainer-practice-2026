import { PageHeader } from "@/components/ui/page-header";
import { WordSetsClient } from "./WordSetsClient";
import { getAllWordSets } from "@/features/word-sets/repository";

export default async function WordSetsPage() {
  // Fetch real data from PostgreSQL via Data Access Layer
  const wordSets = await getAllWordSets();

  return (
    <>
      <PageHeader
        eyebrow="Vocabulary"
        title="Word Sets"
        description="Browse curated vocabulary sets by topic, difficulty, and learning goal."
      />
      
      {/* Pass the database sets to the interactive client component */}
      <WordSetsClient wordSets={wordSets} />
    </>
  );
}
