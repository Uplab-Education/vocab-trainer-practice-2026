import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { TrainingClient } from "./TrainingClient";
import { shuffleArray } from "@/features/word-sets/training";
import { getWordSetById } from "@/features/word-sets/repository";

type PageProps = {
  params: Promise<{
    setId: string;
  }>;
};

// Local component to dry up the empty state branches
function TrainingUnavailable({ title, description, backHref, backLabel }: { title: string, description: string, backHref: string, backLabel: string }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16">
      <EmptyState title={title} description={description} />
      <div className="mt-6 flex justify-center">
        <Link href={backHref} className="text-sm font-medium text-blue-600 hover:underline">
          &larr; {backLabel}
        </Link>
      </div>
    </div>
  );
}

export default async function TrainingSessionPage({ params }: PageProps) {
  // Asynchronously retrieve the parameters
  const resolvedParams = await params;
  const wordSet = await getWordSetById(resolvedParams.setId);

  // Handle the case where the word set is not found
  if (!wordSet) {
    return (
      <TrainingUnavailable 
        title="Set not found"
        description="The vocabulary set you are looking for does not exist."
        backHref="/word-sets"
        backLabel="Back to Word Sets"
      />
    );
  }

  // Guard clause for sets with < 4 words to prevent runtime errors
  if (wordSet.words.length < 4) {
    return (
      <TrainingUnavailable 
        title="Not enough words"
        description="This word set needs at least 4 words to start a training session."
        backHref={`/word-sets/${wordSet.id}`}
        backLabel="Back to Word Set"
      />
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