import Link from "next/link";
import { starterWordSets } from "@/features/word-sets/data";
import { EmptyState } from "@/components/ui/empty-state";
import { TrainingClient } from "./TrainingClient";

type PageProps = {
  params: Promise<{
    setId: string;
  }>;
};

// Fisher-Yates shuffle implementation for unbiased randomness
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

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

  // Guard clause for sets with < 4 words to prevent runtime errors
  if (wordSet.words.length < 4) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-16">
        <EmptyState
          title="Not enough words"
          description="This word set needs at least 4 words to start a training session."
        />
        <div className="mt-6 flex justify-center">
          <Link href={`/word-sets/${wordSet.id}`} className="text-sm font-medium text-blue-600 hover:underline">
            &larr; Back to Word Set
          </Link>
        </div>
      </div>
    );
  }

  // Build the options in the Server Component and pass them as props to restore full SSR
  const firstWord = wordSet.words[0];
  const otherWords = wordSet.words.filter((w) => w.id !== firstWord.id);
  const shuffledOthers = shuffleArray(otherWords);
  const incorrectOptions = shuffledOthers.slice(0, 3).map((w) => w.ukrainianTranslation);
  const initialOptions = shuffleArray([...incorrectOptions, firstWord.ukrainianTranslation]);

  // Pass the word set and dynamically generated initial options to the client component
  return (
    <div className="min-h-full bg-slate-50/50">
      <TrainingClient wordSet={wordSet} initialOptions={initialOptions} />
    </div>
  );
}