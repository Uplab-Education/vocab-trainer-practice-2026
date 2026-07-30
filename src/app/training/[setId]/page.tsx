import Link from "next/link";
import { starterWordSets } from "@/features/word-sets/data";
import { EmptyState } from "@/components/ui/empty-state";
import { TrainingClient } from "./TrainingClient";

type PageProps = {
  params: Promise<{
    setId: string;
  }>;
};

export default async function TrainingSessionPage({ params }: PageProps) {
  // Asynchronously retrieve the parameters
  const resolvedParams = await params;
  
  // Find the word set based on the provided setId
  const wordSet = starterWordSets.find((set) => set.id === resolvedParams.setId);

  // Handle the case where the word set is not found
  if (!wordSet) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-16">
        <EmptyState
          title="Set not found"
          description="The vocabulary set you are looking for does not exist."
        />
        <div className="mt-6 flex justify-center">
          <Link href="/word-sets" className="text-sm font-medium text-blue-600 hover:underline">
            &larr; Back to Word Sets
          </Link>
        </div>
      </div>
    );
  }

  // Pass the word set to the client component
  return (
    <div className="min-h-full bg-slate-50/50">
      <TrainingClient wordSet={wordSet} />
    </div>
  );
}